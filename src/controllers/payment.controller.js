const crypto = require("crypto");
const axios = require("axios");
const { poolPromise, sql } = require("../utils/db");
const { success, error } = require("../utils/response");
const momo = require("../config/momo");
const { v4: uuidv4 } = require("uuid");

// ========== TẠO THANH TOÁN MOMO ==========
exports.createMomoPayment = async (req, res) => {
  const { plan_id } = req.body;
  const userId = req.user.id;

  if (!plan_id) return error(res, 400, "Thiếu plan_id");

  try {
    const pool = await poolPromise;

    // 1. Lấy thông tin gói
    const planResult = await pool.request()
      .input("id", sql.UniqueIdentifier, plan_id)
      .query(`SELECT id, slug, title, price_cents, currency FROM plans WHERE id = @id`);

    if (planResult.recordset.length === 0) {
      return error(res, 404, "Gói không tồn tại");
    }

    const plan = planResult.recordset[0];

    // MoMo dùng amount ở dạng số nguyên VND
    const amount = plan.price_cents;

    const orderId = `${Date.now()}_${userId}`;   // cho unique
    const requestId = orderId;

    const orderInfo = `Mua gói ${plan.title}`;
    const extraData = Buffer.from(JSON.stringify({
      userId,
      planId: plan.id
    })).toString("base64");

    // 2. Tạo signature HMAC
    const rawSignature =
      `accessKey=${momo.accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${momo.ipnUrl}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${momo.partnerCode}` +
      `&redirectUrl=${momo.redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=captureWallet`;

    const signature = crypto
      .createHmac("sha256", momo.secretKey)
      .update(rawSignature)
      .digest("hex");

    const body = {
      partnerCode: momo.partnerCode,
      accessKey: momo.accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: momo.redirectUrl,
      ipnUrl: momo.ipnUrl,
      extraData,
      requestType: "captureWallet",
      signature,
      lang: "vi"
    };

    // 3. Gọi API Momo
    const momoRes = await axios.post(momo.endpoint, body);

    if (momoRes.data.resultCode !== 0) {
      return error(res, 400, `Momo lỗi: ${momoRes.data.message}`);
    }

    // 4. Lưu transaction pending
    await pool.request()
      .input("id", sql.UniqueIdentifier, uuidv4())
      .input("user_id", sql.UniqueIdentifier, userId)
      .input("type", sql.NVarChar, "subscription")
      .input("provider", sql.NVarChar, "momo")
      .input("provider_tx_id", sql.NVarChar, orderId)
      .input("amount_cents", sql.BigInt, plan.price_cents)
      .input("currency", sql.NVarChar, plan.currency || "VND")
      .input("status", sql.NVarChar, "pending")
      .input("metadata", sql.NVarChar(sql.MAX), JSON.stringify({ planId: plan.id }))
      .query(`
        INSERT INTO transactions
        (id, user_id, type, provider, provider_tx_id, amount_cents, currency, status, metadata, created_at)
        VALUES (@id, @user_id, @type, @provider, @provider_tx_id, @amount_cents, @currency, @status, @metadata, SYSDATETIMEOFFSET())
      `);

    // 5. Trả payUrl cho FE
    success(res, { payUrl: momoRes.data.payUrl }, "Tạo thanh toán thành công");
  } catch (err) {
    console.error("❌ createMomoPayment error:", err);
    error(res, 500, "Lỗi server khi tạo thanh toán");
  }
};

// ========== MOMO IPN CALLBACK (FINAL VERSION) ==========
exports.handleMomoIPN = async (req, res) => {
  try {
    const data = req.body;

    const {
      partnerCode,
      accessKey,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = data;

    // ========== 1. Verify signature ==========
    const rawSignature =
      `accessKey=${accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&orderType=${orderType}` +
      `&partnerCode=${partnerCode}` +
      `&payType=${payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const expectedSignature = crypto
      .createHmac("sha256", momo.secretKey)
      .update(rawSignature)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("❌ Sai signature IPN");
      return res.status(400).json({ message: "invalid signature" });
    }

    console.log("✔ Signature hợp lệ!");

    const pool = await poolPromise;

    // ========== 2. Lấy transaction theo orderId ==========
    const txRes = await pool.request()
      .input("orderId", sql.NVarChar, orderId)
      .query(`
        SELECT TOP 1 *
        FROM transactions
        WHERE provider_tx_id = @orderId
      `);

    if (txRes.recordset.length === 0) {
      console.warn("❌ Không tìm thấy transaction:", orderId);
      return res.status(200).json({ message: "transaction not found" });
    }

    const tx = txRes.recordset[0];

    // Nếu đã xử lý rồi, trả OK luôn
    if (tx.status === "success" || tx.status === "failed") {
      return res.status(200).json({ message: "already processed" });
    }

    // ========== 3. Nếu thanh toán thất bại ==========
    if (resultCode !== 0) {
      await pool.request()
        .input("id", sql.UniqueIdentifier, tx.id)
        .input("status", sql.NVarChar, "failed")
        .input("metadata", sql.NVarChar(sql.MAX), JSON.stringify({ momo: data }))
        .query(`
          UPDATE transactions
          SET status = @status,
              metadata = @metadata
          WHERE id = @id
        `);

      return res.status(200).json({ message: "payment failed" });
    }

    // ========== 4. Thanh toán thành công ==========
    let extra = {};
    try {
      extra = JSON.parse(Buffer.from(extraData, "base64").toString("utf8"));
    } catch {}

    const userId = extra.userId || tx.user_id;
    const planId = extra.planId;

    // 4.1 Cập nhật transaction
    await pool.request()
      .input("id", sql.UniqueIdentifier, tx.id)
      .input("status", sql.NVarChar, "success")
      .input("metadata", sql.NVarChar(sql.MAX), JSON.stringify({ ...extra, momo: data }))
      .query(`
        UPDATE transactions
        SET status = @status,
            metadata = @metadata
        WHERE id = @id
      `);

    // ========== 5. Hủy subscription cũ nếu có ==========
    await pool.request()
      .input("user_id", sql.UniqueIdentifier, userId)
      .query(`
        UPDATE subscriptions
        SET status = 'expired'
        WHERE user_id = @user_id AND status = 'active'
      `);

    // ========== 6. Tạo subscription mới ==========
    const now = new Date();
    const startAt = now;  
    const endAt = new Date(now.getFullYear(), now.getMonth() + 1, 0); // cuối tháng

    await pool.request()
      .input("id", sql.UniqueIdentifier, uuidv4())
      .input("user_id", sql.UniqueIdentifier, userId)
      .input("plan_id", sql.UniqueIdentifier, planId)
      .input("status", sql.NVarChar, "active")
      .input("start_at", sql.DateTimeOffset, startAt)
      .input("end_at", sql.DateTimeOffset, endAt)
      .input("raw_provider", sql.NVarChar(sql.MAX), "momo")
      .query(`
        INSERT INTO subscriptions (id, user_id, plan_id, status, start_at, end_at, raw_provider, created_at)
        VALUES (@id, @user_id, @plan_id, @status, @start_at, @end_at, @raw_provider, SYSDATETIMEOFFSET())
      `);

    console.log("🎉 Subscription mới tạo cho user:", userId);

    return res.status(200).json({ message: "ok" });

  } catch (err) {
    console.error("❌ IPN error:", err);
    return res.status(500).json({ message: "server error" });
  }
};


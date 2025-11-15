USE [CTEDataBase]
GO

/****** Object:  Table [dbo].[audit_logs]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[audit_logs](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[action] [nvarchar](100) NOT NULL,
	[object_type] [nvarchar](100) NULL,
	[object_id] [nvarchar](100) NULL,
	[ip] [nvarchar](45) NULL,
	[extra] [nvarchar](max) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[auth_providers]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[auth_providers](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[provider] [nvarchar](100) NOT NULL,
	[provider_user_id] [nvarchar](255) NULL,
	[password_hash] [nvarchar](255) NULL,
	[extra] [nvarchar](max) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[daily_usage_summary]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[daily_usage_summary](
	[user_id] [uniqueidentifier] NOT NULL,
	[day] [date] NOT NULL,
	[requests_count] [int] NULL,
	[tokens_total] [bigint] NULL,
	[seconds_total] [bigint] NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC,
	[day] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[plans]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[plans](
	[id] [uniqueidentifier] NOT NULL,
	[slug] [nvarchar](100) NOT NULL,
	[title] [nvarchar](255) NOT NULL,
	[price_cents] [bigint] NOT NULL,
	[currency] [nvarchar](10) NOT NULL,
	[token_amount] [bigint] NULL,
	[monthly_quota] [bigint] NULL,
	[benefits] [nvarchar](max) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[slug] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sessions]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sessions](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[session_token] [nvarchar](500) NOT NULL,
	[device_info] [nvarchar](255) NULL,
	[ip] [nvarchar](45) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[last_active_at] [datetimeoffset](7) NULL,
	[expires_at] [datetimeoffset](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[session_token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[subscriptions]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[subscriptions](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[plan_id] [uniqueidentifier] NOT NULL,
	[status] [nvarchar](50) NOT NULL,
	[start_at] [datetimeoffset](7) NULL,
	[end_at] [datetimeoffset](7) NULL,
	[raw_provider] [nvarchar](max) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tokens_wallets]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tokens_wallets](
	[user_id] [uniqueidentifier] NOT NULL,
	[balance] [bigint] NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[transactions]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[transactions](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[type] [nvarchar](50) NOT NULL,
	[provider] [nvarchar](50) NOT NULL,
	[provider_tx_id] [nvarchar](255) NULL,
	[amount_cents] [bigint] NOT NULL,
	[currency] [nvarchar](10) NOT NULL,
	[tokens_granted] [bigint] NULL,
	[status] [nvarchar](50) NOT NULL,
	[metadata] [nvarchar](max) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[translation_jobs]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[translation_jobs](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[input_source] [nvarchar](500) NULL,
	[source_lang] [nvarchar](10) NULL,
	[target_lang] [nvarchar](10) NULL,
	[pages] [int] NULL,
	[token_used] [bigint] NULL,
	[status] [nvarchar](50) NOT NULL,
	[result_url] [nvarchar](500) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[finished_at] [datetimeoffset](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[usage_events]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[usage_events](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[translation_job_id] [uniqueidentifier] NULL,
	[event_type] [nvarchar](100) NOT NULL,
	[tokens_used] [bigint] NULL,
	[duration_seconds] [int] NULL,
	[metadata] [nvarchar](max) NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users](
	[id] [uniqueidentifier] NOT NULL,
	[email] [nvarchar](255) NOT NULL,
	[display_name] [nvarchar](255) NULL,
	[avatar_url] [nvarchar](500) NULL,
	[is_email_verified] [bit] NOT NULL,
	[created_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- BEGIN: BẢNG MỚI CHO PROFILE & AVATAR
-- =============================================

/****** Object:  Table [dbo].[user_nickname_history]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_nickname_history](
	[id] [bigint] IDENTITY(1,1) NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[old_nickname] [nvarchar](255) NULL,
	[new_nickname] [nvarchar](255) NOT NULL,
	[changed_at] [datetimeoffset](7) NOT NULL,
	[changed_by_ip] [nvarchar](45) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[user_avatars]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_avatars](
	[id] [uniqueidentifier] NOT NULL,
	[user_id] [uniqueidentifier] NOT NULL,
	[avatar_url] [nvarchar](500) NOT NULL,
	[avatar_type] [nvarchar](50) NULL,
	[file_size_bytes] [bigint] NULL,
	[mime_type] [nvarchar](100) NULL,
	[is_active] [bit] NOT NULL,
	[uploaded_at] [datetimeoffset](7) NOT NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[user_profile_settings]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_profile_settings](
	[user_id] [uniqueidentifier] NOT NULL,
	[nickname] [nvarchar](255) NULL,
	[bio] [nvarchar](500) NULL,
	[show_email] [bit] NOT NULL,
	[show_online_status] [bit] NOT NULL,
	[language_preference] [nvarchar](10) NULL,
	[theme_preference] [nvarchar](50) NULL,
	[updated_at] [datetimeoffset](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- BEGIN: BẢNG MỚI CHO PHÂN QUYỀN ADMIN (RBAC)
-- =============================================

/****** Object:  Table [dbo].[roles]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[roles](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

/****** Object:  Table [dbo].[user_roles]  ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[user_roles](
	[user_id] [uniqueidentifier] NOT NULL,
	[role_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[user_id] ASC,
	[role_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

-- =============================================
-- BEGIN: DEFAULT CONSTRAINTS (CŨ)
-- =============================================
ALTER TABLE [dbo].[audit_logs] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[auth_providers] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[auth_providers] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[plans] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[plans] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[sessions] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[sessions] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[subscriptions] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[subscriptions] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[tokens_wallets] ADD  DEFAULT ((0)) FOR [balance]
GO
ALTER TABLE [dbo].[tokens_wallets] ADD  DEFAULT (sysdatetimeoffset()) FOR [updated_at]
GO
ALTER TABLE [dbo].[transactions] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[transactions] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[translation_jobs] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[translation_jobs] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[usage_events] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT ((0)) FOR [is_email_verified]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (sysdatetimeoffset()) FOR [created_at]
GO
ALTER TABLE [dbo].[users] ADD  DEFAULT (sysdatetimeoffset()) FOR [updated_at]
GO

-- =============================================
-- BEGIN: DEFAULT CONSTRAINTS (MỚI)
-- =============================================
ALTER TABLE [dbo].[user_nickname_history] ADD DEFAULT (sysdatetimeoffset()) FOR [changed_at]
GO
ALTER TABLE [dbo].[user_avatars] ADD DEFAULT (newid()) FOR [id]
GO
ALTER TABLE [dbo].[user_avatars] ADD DEFAULT (1) FOR [is_active]
GO
ALTER TABLE [dbo].[user_avatars] ADD DEFAULT (sysdatetimeoffset()) FOR [uploaded_at]
GO
ALTER TABLE [dbo].[user_avatars] ADD DEFAULT (sysdatetimeoffset()) FOR [updated_at]
GO
ALTER TABLE [dbo].[user_profile_settings] ADD DEFAULT (0) FOR [show_email]
GO
ALTER TABLE [dbo].[user_profile_settings] ADD DEFAULT (1) FOR [show_online_status]
GO
ALTER TABLE [dbo].[user_profile_settings] ADD DEFAULT (sysdatetimeoffset()) FOR [updated_at]
GO

-- =============================================
-- BEGIN: FOREIGN KEY CONSTRAINTS (CŨ)
-- =============================================
ALTER TABLE [dbo].[audit_logs]  WITH CHECK ADD  CONSTRAINT [FK_audit_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[audit_logs] CHECK CONSTRAINT [FK_audit_user]
GO
ALTER TABLE [dbo].[auth_providers]  WITH CHECK ADD  CONSTRAINT [FK_auth_providers_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[auth_providers] CHECK CONSTRAINT [FK_auth_providers_user]
GO
ALTER TABLE [dbo].[daily_usage_summary]  WITH CHECK ADD  CONSTRAINT [FK_summary_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[daily_usage_summary] CHECK CONSTRAINT [FK_summary_user]
GO
ALTER TABLE [dbo].[sessions]  WITH CHECK ADD  CONSTRAINT [FK_sessions_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[sessions] CHECK CONSTRAINT [FK_sessions_user]
GO
ALTER TABLE [dbo].[subscriptions]  WITH CHECK ADD  CONSTRAINT [FK_subscriptions_plan] FOREIGN KEY([plan_id])
REFERENCES [dbo].[plans] ([id])
GO
ALTER TABLE [dbo].[subscriptions] CHECK CONSTRAINT [FK_subscriptions_plan]
GO
ALTER TABLE [dbo].[subscriptions]  WITH CHECK ADD  CONSTRAINT [FK_subscriptions_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[subscriptions] CHECK CONSTRAINT [FK_subscriptions_user]
GO
ALTER TABLE [dbo].[tokens_wallets]  WITH CHECK ADD  CONSTRAINT [FK_wallets_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[tokens_wallets] CHECK CONSTRAINT [FK_wallets_user]
GO
ALTER TABLE [dbo].[transactions]  WITH CHECK ADD  CONSTRAINT [FK_transactions_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[transactions] CHECK CONSTRAINT [FK_transactions_user]
GO
ALTER TABLE [dbo].[translation_jobs]  WITH CHECK ADD  CONSTRAINT [FK_jobs_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[translation_jobs] CHECK CONSTRAINT [FK_jobs_user]
GO
ALTER TABLE [dbo].[usage_events]  WITH CHECK ADD  CONSTRAINT [FK_usage_job] FOREIGN KEY([translation_job_id])
REFERENCES [dbo].[translation_jobs] ([id])
GO
ALTER TABLE [dbo].[usage_events] CHECK CONSTRAINT [FK_usage_job]
GO
ALTER TABLE [dbo].[usage_events]  WITH CHECK ADD  CONSTRAINT [FK_usage_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
GO
ALTER TABLE [dbo].[usage_events] CHECK CONSTRAINT [FK_usage_user]
GO

-- =============================================
-- BEGIN: FOREIGN KEY CONSTRAINTS (MỚI)
-- =============================================
ALTER TABLE [dbo].[user_nickname_history] WITH CHECK ADD CONSTRAINT [FK_nickname_history_user] 
FOREIGN KEY([user_id]) REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[user_nickname_history] CHECK CONSTRAINT [FK_nickname_history_user]
GO

ALTER TABLE [dbo].[user_avatars] WITH CHECK ADD CONSTRAINT [FK_avatars_user] 
FOREIGN KEY([user_id]) REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[user_avatars] CHECK CONSTRAINT [FK_avatars_user]
GO

ALTER TABLE [dbo].[user_profile_settings] WITH CHECK ADD CONSTRAINT [FK_profile_settings_user] 
FOREIGN KEY([user_id]) REFERENCES [dbo].[users] ([id]) ON DELETE CASCADE
GO
ALTER TABLE [dbo].[user_profile_settings] CHECK CONSTRAINT [FK_profile_settings_user]
GO

ALTER TABLE [dbo].[user_roles]  WITH CHECK ADD  CONSTRAINT [FK_user_roles_role] FOREIGN KEY([role_id])
REFERENCES [dbo].[roles] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[user_roles] CHECK CONSTRAINT [FK_user_roles_role]
GO

ALTER TABLE [dbo].[user_roles]  WITH CHECK ADD  CONSTRAINT [FK_user_roles_user] FOREIGN KEY([user_id])
REFERENCES [dbo].[users] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[user_roles] CHECK CONSTRAINT [FK_user_roles_user]
GO

-- =============================================
-- BEGIN: INDEXES, CHECKS, SPROCS, VIEWS (MỚI)
-- =============================================

CREATE NONCLUSTERED INDEX [IX_nickname_history_user_date] 
ON [dbo].[user_nickname_history] ([user_id], [changed_at] DESC)
GO

CREATE NONCLUSTERED INDEX [IX_avatars_user_active] 
ON [dbo].[user_avatars] ([user_id], [is_active]) 
WHERE [is_active] = 1
GO

ALTER TABLE [dbo].[user_profile_settings] ADD CONSTRAINT [CK_nickname_length] 
CHECK (LEN([nickname]) >= 3 AND LEN([nickname]) <= 50)
GO

ALTER TABLE [dbo].[user_avatars] ADD CONSTRAINT [CK_file_size] 
CHECK ([file_size_bytes] IS NULL OR [file_size_bytes] <= 5242880) -- Max 5MB
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateUserNickname]
	@user_id uniqueidentifier,
	@new_nickname nvarchar(255),
	@ip_address nvarchar(45) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @old_nickname nvarchar(255);
	
	SELECT @old_nickname = nickname 
	FROM user_profile_settings 
	WHERE user_id = @user_id;
	
	IF EXISTS (SELECT 1 FROM user_profile_settings WHERE nickname = @new_nickname AND user_id != @user_id)
	BEGIN
		THROW 50001, 'Nickname đã được sử dụng bởi người khác', 1;
		RETURN;
	END
	
	BEGIN TRANSACTION;
	
	TRY
		IF EXISTS (SELECT 1 FROM user_profile_settings WHERE user_id = @user_id)
		BEGIN
			UPDATE user_profile_settings
			SET nickname = @new_nickname,
				updated_at = SYSDATETIMEOFFSET()
			WHERE user_id = @user_id;
		END
		ELSE
		BEGIN
			INSERT INTO user_profile_settings (user_id, nickname, updated_at)
			VALUES (@user_id, @new_nickname, SYSDATETIMEOFFSET());
		END
		
		INSERT INTO user_nickname_history (user_id, old_nickname, new_nickname, changed_by_ip)
		VALUES (@user_id, @old_nickname, @new_nickname, @ip_address);
		
		UPDATE users
		SET display_name = @new_nickname,
			updated_at = SYSDATETIMEOFFSET()
		WHERE id = @user_id;
		
		COMMIT TRANSACTION;
		
		SELECT 'SUCCESS' as Status, @new_nickname as NewNickname;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_UploadUserAvatar]
	@user_id uniqueidentifier,
	@avatar_url nvarchar(500),
	@avatar_type nvarchar(50) = 'uploaded',
	@file_size_bytes bigint = NULL,
	@mime_type nvarchar(100) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	
	BEGIN TRANSACTION;
	
	TRY
		UPDATE user_avatars
		SET is_active = 0,
			updated_at = SYSDATETIMEOFFSET()
		WHERE user_id = @user_id;
		
		DECLARE @new_avatar_id uniqueidentifier = NEWID();
		
		INSERT INTO user_avatars (id, user_id, avatar_url, avatar_type, file_size_bytes, mime_type, is_active)
		VALUES (@new_avatar_id, @user_id, @avatar_url, @avatar_type, @file_size_bytes, @mime_type, 1);
		
		UPDATE users
		SET avatar_url = @avatar_url,
			updated_at = SYSDATETIMEOFFSET()
		WHERE id = @user_id;
		
		COMMIT TRANSACTION;
		
		SELECT 'SUCCESS' as Status, @new_avatar_id as AvatarId, @avatar_url as AvatarUrl;
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO

CREATE OR ALTER VIEW [dbo].[vw_UserProfiles] AS
SELECT 
	u.id as user_id,
	u.email,
	u.display_name,
	u.avatar_url as current_avatar_url,
	u.is_email_verified,
	u.created_at as user_created_at,
	ups.nickname,
	ups.bio,
	ups.show_email,
	ups.show_online_status,
	ups.language_preference,
	ups.theme_preference,
	ups.updated_at as profile_updated_at,
	ua.avatar_type,
	ua.file_size_bytes as avatar_size,
	ua.uploaded_at as avatar_uploaded_at
FROM users u
LEFT JOIN user_profile_settings ups ON u.id = ups.user_id
LEFT JOIN user_avatars ua ON u.id = ua.user_id AND ua.is_active = 1
GO

CREATE OR ALTER FUNCTION [dbo].[fn_GetNicknameHistory](@user_id uniqueidentifier)
RETURNS TABLE
AS
RETURN
(
	SELECT 
		id,
		old_nickname,
		new_nickname,
		changed_at,
		changed_by_ip
	FROM user_nickname_history
	WHERE user_id = @user_id
)
GO

-- =============================================
-- BEGIN: KHỞI TẠO DỮ LIỆU CẦN THIẾT (MỚI)
-- =============================================
INSERT INTO [dbo].[roles] (name) VALUES (N'admin'), (N'user');
GO
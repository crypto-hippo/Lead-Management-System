CREATE TABLE [dev].[dbo].[User] (
    [id] bigint IDENTITY(1,1),
    [first_name] varchar(255),
    [last_name] varchar(255),
    [email] varchar(255),
    [is_admin] bit DEFAULT ('0'),
    PRIMARY KEY ([id])
);

CREATE TABLE [dev].[dbo].[BatchLead] (
    [id] bigint IDENTITY(1,1) not null,
    [first_name] varchar(255) not null,
    [last_name] varchar(255) not null,
    [selectcare_account_id] varchar(10) not null,
    [selectcare_lead_id] varchar(10) not null,
    [selectchat_campaign_id] bigint not null,
    [agent_email] varchar(255) not null,
    [phone] varchar(255) not null,
    PRIMARY KEY ([id])
);

CREATE TABLE [dev].[dbo].[BatchFile] (
    [id] bigint IDENTITY(1,1),
    [file_name] varchar(255) not null,
    [lead_count] int not null,
    [upload_date] datetime not null,
    [description] text not null,
    [user_id] bigint not null,
    PRIMARY KEY ([id])
)

CREATE TABLE [dev].[dbo].[Campaign] (
    [id] bigint IDENTITY(1,1) not null,
    [description] text not null,
    [type] varchar(255) not null,
    [method] varchar(255) not null,
    [name] varchar(255) not null
    PRIMARY KEY ([id])
)

CREATE FULLTEXT CATALOG dev_FTCat WITH ACCENT_SENSITIVITY = OFF
GO

CREATE UNIQUE INDEX ui_fulltext_bl ON [dbo].[BatchLead](ID);  

CREATE FULLTEXT INDEX ON [dbo].[BatchLead]
(
    first_name,                         --Full-text index column name 
    last_name,
    selectcare_account_id,
    selectcare_lead_id,
    agent_email,
    phone
)
KEY INDEX ui_fulltext_bl ON dev_FTCat --Unique index
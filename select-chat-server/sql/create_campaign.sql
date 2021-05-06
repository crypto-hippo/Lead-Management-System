CREATE TABLE [dbo].[Campaign] (
    [id] bigint NOT NULL,
    [title] varchar(255) NOT NULL,
    [description] text NOT NULL,
    [campaign_type] varchar(255) NOT NULL,
    [communication_method] varchar(255) NOT NULL,
    [status] varchar(255) NOT NULL, 
    PRIMARY KEY (id)
);
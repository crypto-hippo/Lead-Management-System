
const errors = {
    file_name_exists: {error: true, error_message: "File name already exists."},
    invalid_file_name: {error: true, error_message: "Please enter a valid filename."},
    no_valid_records: {error: true, error_message: "No valid records found."},
    no_auth: {error: true, error_message: 'User is not authorized. Please sign in to continue.'},
    invalid_campaign: {error: true, error_message: "Campaign data is Invalid. All fields are required."},
    save_campaign: {error: true, error_message: "Unable to save campaign. Please try again later."},
    campaign_exists: {error: true, error_message: "The Campaign name already exists."},
    update_campaign: {error: true, error_message: "An error acurred while updating the campaign."},
    campaign_required: {error: true, error_message: "A campaign is required for this request"},
    campaign_name_exists: {error: true, error_message: "The campaign name already exists."},
    invalid_dflow_message: {error: true, error_message: "Invalid message data."},
    failed_dflow_message: {error: true, error_message: "Unable to send message. Please try again later."}
}

module.exports = errors;




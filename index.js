const AWS = require('aws-sdk');
const awsSns = new AWS.SNS();

exports.handler = async (event) => {
    try {
        let startTime = '04:00:00';
        let endTime = '05:00:00';

        let currentDate = new Date(event.Records[0].eventTime)

        let startDate = new Date(currentDate.getTime());
        startDate.setHours(startTime.split(":")[0]);
        startDate.setMinutes(startTime.split(":")[1]);
        startDate.setSeconds(startTime.split(":")[2]);

        let endDate = new Date(currentDate.getTime());
        endDate.setHours(endTime.split(":")[0]);
        endDate.setMinutes(endTime.split(":")[1]);
        endDate.setSeconds(endTime.split(":")[2]);

        let validTime = startDate < currentDate && endDate > currentDate
        if (!validTime) {
            const message = {
                "Status": "File uploaded outside time window."
            };

            const params = {
                Message: JSON.stringify(message),
                MessageStructure: 'json',
                TopicArn: process.env.TOPIC_ARN
            };
            await awsSns.publish(params).promise();
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                'Message': 'All OK'
            })
        };

    } catch (err) {
        console.log('Error Occurred :: ' + err);
        return {
            statusCode: 500,
            body: JSON.stringify(err)
        };
    }
};




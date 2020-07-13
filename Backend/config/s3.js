   const AWS = require('aws-sdk');

      let s3bucket = new AWS.S3({
         accessKeyId: "AKIAJUNN5276J5VSR7OQ",
         secretAccessKey: "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",
      });

      module.exports = s3bucket;
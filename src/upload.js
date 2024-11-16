const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// AWS 설정
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

// Multer와 S3를 사용하여 파일 업로드 설정
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `job-postings/${Date.now()}_${file.originalname}`);
    }
  })
});

module.exports = upload;

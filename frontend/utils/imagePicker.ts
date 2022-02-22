import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";

const credentials = new AWS.Credentials(
  "AKIAUKHYDKQMXSHHZNRB",
  "sJn8HmjekRPZtBCZSBIKXR550pyTHvc/uxAbFJSK"
);
AWS.config.update({
  region: "us-east-2",
  accessKeyId: "AKIAUKHYDKQMXSHHZNRB",
  accessSecretKey: "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",
});
AWS.config.credentials = credentials;

const S3 = new AWS.S3();
const S3_BUCKET_NAME = "uwfind53028-staging";

const fetchImageFromUri = async (uri: RequestInfo) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const parts = uri.toString().split("/");
  if (parts.length == 0) alert("Unable to retrieve filename");
  return { blob, filename: parts[parts.length - 1] };
};

const uploadImage = (filename: string, img: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `public/${filename}`,
      Body: img,
      ACL: "public-read",
    };
    S3.putObject(params, (err: any, data: any) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(
        `https://uwfind53028-staging.s3.us-east-2.amazonaws.com/public/${filename}`
      );
    });
  });
};

const handleImagePicked = async (
  pickerResult: ImagePicker.ImagePickerResult
): Promise<string> => {
  try {
    if (pickerResult.cancelled) {
      return "";
    }
    const data = await fetchImageFromUri(pickerResult.uri);
    const uploadUrl = await uploadImage(data.filename, data.blob);
    console.log("url", uploadUrl);
    return uploadUrl;
  } catch (e) {
    console.log(e);
    alert("Upload to S3 failed");
    return ""
  }
};

const pickImage = async (): Promise<string> => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [4, 3],
    quality: 1,
  });
  return handleImagePicked(result);
};

const takePhoto = async (): Promise<string> => {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [4, 3],
  });

  return handleImagePicked(result);
};

export { pickImage, takePhoto };

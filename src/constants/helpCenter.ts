type TutorialsItem = {
  heading: string;
  url: string;
  isLink: boolean;
};

type DocumentsItem = {
  heading: string;
  content: string;
  isLink: boolean;
};

type FAQItem = {
  heading: string;
  content: string;
  isLink: boolean;
};
export const FAQ: FAQItem[] = [
  {
    heading: "What is XenCapture?",
    content:
      "XenCapture is a mobile and web app that allows you to create 3D models of real-world objects from 2D photos or videos.",
    isLink: false,
  },
  {
    heading: "What can I use XenCapture for?",
    content:
      "XenCapture can be used for various purposes, such as for e-commerce, creative visualization, etc. You can use it to create 3D models of retail products, digital twins, game assets, characters, or anything else you can imagine.",
    isLink: false,
  },
  {
    heading: "Is XenCapture free to use?",
    content:
      "Yes! We allow users to download the application and generate models for free. However, the feature to download a 3D model will only be available when the user has purchased the 3D model.",
    isLink: false,
  },
  {
    heading: "How easy is to sign up for XenCapture?",
    content:
      "Signing up only requires a user to enter a valid email address along with a password. We also accept Google/Apple login to make the sign up process even faster!",
    isLink: false,
  },
  {
    heading: "How do I capture images/videos using the app?",
    content:
      "Refer to our tutorial here to learn more about how to capture images/videos from the application.",
    isLink: false,
  },
  {
    heading: "What devices does XenCapture support?",
    content: `
        XenCapture application is supported on:
        1. **iPhone**: Mobiles running iOS 11 & above.
        2. **Android**: Mobiles running Android 8.1 & above.
        3. **Web Application**: Available for Windows & macOS.
    `,
    isLink: false,
  },
  {
    heading: "Why did my model fail to generate?",
    content: `
        Reasons why the model could have failed during generation include:
        1. **Unstable internet connection**: Ensure you have a stable internet connection while uploading your images/video.
        2. **Application interruption**: Do not quit the application while the images are being uploaded.
        3. **Insufficient images**: Refer to our tutorial [here](#) to understand how many images to capture.
        4. **Incorrect image capture**: Refer to our tutorial [here](#) to understand how to capture images correctly.
    `,
    isLink: false,
  },
  {
    heading: "What formats can I export in once I buy the 3D model?",
    content:
      "XenCapture can export meshes in the following formats: GLB, USDZ, FBX, OBJ, and STL",
    isLink: false,
  },
  {
    heading: "How much do I have to pay for XenCapture?",
    content:
      "XenCapture is a completely free application to use to generate 3D models. However, we charge a one-time fee to download a 3D model that has been generated. Once the model has been purchased, users gains unlimited access to that model.",
    isLink: false,
  },
];
export const Tutorials: TutorialsItem[] = [
  {
    heading: "How to Capture Images in 'Capture' Mode",
    url: "https://youtu.be/7FeBMZYTbWM",
    isLink: true,
  },
  {
    heading: "How to Upload Images in 'Upload' Mode",
    url: "https://youtu.be/YjJQr2FrAeU?si=rC9RwqnUVgBPgfnZ",
    isLink: true,
  },
];

export const Documents: DocumentsItem[] = [
  {
    heading: "Introduction",
    content:
      "The XenCapture Documentation helps you learn how to use the XenCapture app and best practices. You can read it from start to finish, or use it as a reference.",
    isLink: false,
  },
  {
    heading: "Application",
    content: `
● The XenCapture application is available on the App Store for iOS, Playstore for Android and Web.\newLine
● The application is compatible with devices running iOS 11+ for iPhone & Android 10+ for other smartphones.\newLine
● The application requires permission from your smartphone camera and network to capture images and generate them.`,
    isLink: false,
  },
  {
    heading: "Features - 3D Model Generation",
    content: `
1. Capture images and videos of any real-world objects and quickly convert them into 3D models on your device, no LiDAR required!
Images can either be captured using the built-in capture feature or be uploaded from a user's gallery using upload.
The capture feature can be accessed by clicking the ‘Capture’ button in the bottom menu.\newLine
2. Easily organise and manage all your 3D models within the app.
All 3D models generated are saved in the ‘Projects’ section within the application.
Here is where you can view 3D models, access AR and download 3D models of your choice.\newLine
3. All 3D models generated can be viewed in AR, this allows users to visualise their 3D models in their own space.
Each user is allowed to view their 3D model for free up to five times, after which they are required to purchase the model for a one-time fee. This fee will enable them to download and view the model an unlimited number of times.
AR view of the model can be accessed by clicking on a project and then clicking the embedded ‘View in AR’ button.\newLine
4. XenCapture allows its users to further refine the models they have generated.\newLine
  ● Crop: allows users to remove parts of the 3D model which are not required.\newLine
  ● Scale: allows users to increase/decrease the size of the model in order to match the size of the object in the real world more accurately.\newLine
  ● Translate: allows the user to change the position or rotation of the generated 3D model.\newLine
5. Export:
 XenCapture allows exporting of 3D models in multiple formats, such as USDZ, GLB, FBX, OBJ, and STL. The export feature is activated upon the purchase of a 3D model. Once purchased, the user can download the 3D model in any format an unlimited number of times.`,
    isLink: false,
  },
  {
    heading: "Best Practices to Capture",
    content: `
1. Position Object\newLine
 For best results, it is important that the setup to capture the images is done correctly:\newLine
  ● Ensure good lighting, and ensure all parts of the object being captured are well lit. Sunlight works best!\newLine
  ● Place the object so that there is enough space for you to complete at least one full rotation around the object.\newLine
  ● Avoid using reflective or transparent objects for best results.\newLine
2. Capture\newLine
Follow the steps below for the best outputs:\newLine
  ● Ensure the object of interest is always in the centre of the camera viewfinder.\newLine
  ● Start by taking a picture and slowly moving to the right, taking an image each time you move. The goal is to capture all sides of the image.\newLine
  ● Ensure that there is at least an 80% overlap between one image to the next.\newLine
Below is a guide to gauge the number of images to be taken:\newLine
  ● Small Objects (Eg: Books, Shoes) ~ 30-35 images\newLine
  ● Medium Objects (Eg: Plants, Chairs) ~ 50-60 images\newLine
  ● Large Objects (Eg: Refrigerators, TVs) ~ 75-80 images.`,
    isLink: false,
  },
];

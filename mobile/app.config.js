export default {
  expo: {
    name: 'MEDICA+',
    slug: 'medica-plus',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#f0f4ff',
      },
    },
    extra: {
      apiUrl: process.env.API_URL || 'http://192.168.1.177:5000/api',
    },
  },
};
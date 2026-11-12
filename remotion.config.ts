import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setPixelFormat('yuv420p');
Config.setConcurrency(null); // use all available cores
Config.setShowLayerFrameNumbers(true);
Config.setHighContrast(true);

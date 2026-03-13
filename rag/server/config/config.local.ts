import { EggAppConfig, PowerPartial } from 'egg';

export default (): PowerPartial<EggAppConfig> => {
  const config = {} as PowerPartial<EggAppConfig>;

  config.logger = {
    consoleLevel: 'DEBUG',
  };

  return config;
};

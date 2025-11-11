import {useEffect, useState} from 'react';

export const useSmfaCooldown = (cooldownUntil: number | null) => {
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    const update = () => {
      if (cooldownUntil) {
        const remaining = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
        setCooldownSeconds(remaining);
      } else {
        setCooldownSeconds(0);
      }
    };

    update();

    if (!cooldownUntil) {
      return undefined;
    }

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [cooldownUntil]);

  return {
    cooldownSeconds,
    isCooldownActive: cooldownSeconds > 0,
  };
};

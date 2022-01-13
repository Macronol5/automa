import { set as setObjectPath } from 'object-path-immutable';
import dayjs from '@/lib/dayjs';
import { objectHasKey } from '@/utils/helper';
import mustacheReplacer from './mustache-replacer';

export const funcs = {
  date(...args) {
    let date = new Date();
    let dateFormat = 'DD-MM-YYYY';

    const getDateFormat = (value) =>
      value ? value?.replace(/['"]/g, '') : dateFormat;

    if (args.length === 1) {
      dateFormat = getDateFormat(args[0]);
    } else if (args.length >= 2) {
      date = new Date(args[0]);
      dateFormat = getDateFormat(args[1]);
    }

    /* eslint-disable-next-line */
    const isValidDate = date instanceof Date && !isNaN(date);
    const dayjsDate = dayjs(isValidDate ? date : Date.now());

    const result =
      dateFormat === 'relative'
        ? dayjsDate.fromNow()
        : dayjsDate.format(dateFormat);

    return result;
  },
  randint(min = 0, max = 100) {
    return Math.round(Math.random() * (+max - +min) + +min);
  },
};

export default function ({ block, data: refData }) {
  const replaceKeys = [
    'url',
    'name',
    'body',
    'value',
    'fileName',
    'selector',
    'prefixText',
    'customData',
    'globalData',
    'suffixText',
    'extraRowValue',
  ];
  let replacedBlock = { ...block };
  const data = Object.assign(refData, { funcs });

  replaceKeys.forEach((blockDataKey) => {
    if (!objectHasKey(block.data, blockDataKey)) return;

    const newDataValue = mustacheReplacer({
      data,
      block,
      str: replacedBlock.data[blockDataKey],
    });

    replacedBlock = setObjectPath(
      replacedBlock,
      `data.${blockDataKey}`,
      newDataValue
    );
  });

  return replacedBlock;
}
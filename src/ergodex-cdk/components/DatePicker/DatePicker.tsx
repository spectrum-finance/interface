import 'antd/es/date-picker/style/index';
import './DatePicker.less';

import generatePicker from 'antd/es/date-picker/generatePicker';
import { DateTime } from 'luxon';

import { luxonGenerateConfig } from './luxon.conf';

const DatePicker = generatePicker<DateTime>(luxonGenerateConfig);

export { DatePicker };

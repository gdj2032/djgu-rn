


interface IPickerBase {
}

type DATE_PICKER_MODE = 'date' | 'time' | 'date-time';

interface IDatePickerProps extends IPickerBase {
  /**
  * 是否显示选择器
  *
  * @type {boolean}
  * @memberof IPickerProps
  */
  visible: boolean;
  /**
   * 选择器的模式
   * date 日期
   * time 时间
   * date-time 日期+时间
   *
   * @type {DATE_PICKER_MODE}
   * @memberof IPickerProps
   */
  mode: DATE_PICKER_MODE;
  /**
   * 默认选中时间
   * 默认今天
   * 'date' | 'time' | 'date-time' 有效
   *
   * @type {Date}
   * @memberof IPickerProps
   */
  defaultDate?: Date;
  /**
   * 最小可选日期
   * 'date' | 'time' | 'date-time' 有效
   *
   * @default (2000-1-1)
   * @type {Date}
   * @memberof IPickerProps
   */
  minDate?: Date;
  /**
   * 最大可选日期
   * 'date' | 'time' | 'date-time' 有效
   *
   * @default (2030-1-1)
   * @type {Date}
   * @memberof IPickerProps
   */
  maxDate?: Date;
  /**
 * 是否禁用
 *
 * @type {boolean}
 * @memberof IPickerProps
 */
  disabled?: boolean;
}

/**
 * Component NumField
 *
 * History:
 * Date         PIC       Note
 * 01/07/2022   QuangPH2    Create
 */

import {
  FormHelperText,
  InputAdornment,
  InternalStandardProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { CreateCSSProperties, createStyles, styled } from '@mui/styles';
import React, { ChangeEvent, Component, FocusEvent, RefObject } from 'react';
import { EMPTY, ERROR_TYPE, OUT_OF_RANGE, OUT_OF_ROBOT_PAYLOAD } from './types';
import { deepCompareEqual, scrollToEndElement } from './util';
declare const window: any;
const INPUT_MAX_LENGTH = 11;
interface NumFieldProps extends Partial<InternalStandardProps<HTMLElement>> {
  label?: string;
  disabled?: boolean;
  startAdorment?: string;
  endAdorment?: string;
  min?: number;
  minExclusive?: boolean;
  max?: number;
  maxExclusive?: boolean;
  onChange?: (currentValue: number | null) => void;
  onError?: (errorType: ERROR_TYPE | null) => string;
  customProps?: TextFieldProps;
  value?: number | null;
  zeroLength?: number;
  error?: boolean;
  allowNegative?: boolean;
  allowDot?: boolean;
  remainRobotPayload?: number;
  maxRange?: number;
  minRange?: number;
  defaultValueWhenBlank?: number;
  exceptionMax?: number;
  showError?: boolean;
  textAlign?: CanvasTextAlign;
  maxDigitLength?: number;
}
interface NumFieldState {
  error: string;
  isError: boolean;
}

const styles = createStyles({
  '&': {
    minWidth: '28px',
    height: '36px',
    textAlign: 'center',
    borderRight: '1px solid rgb(215, 220, 224)',
    paddingLeft: 0,
  },

  '& > span': {
    width: '100%',
  },
});

const StyledInputAdornment = styled(InputAdornment)(
  styles as CreateCSSProperties,
);

const stylesField = createStyles({
  '& .MuiOutlinedInput-notchedOutline': {
    outline: 'none !important',
  },
  '& > .MuiInputBase-root::after': {
    border: 'none',
    width: '0',
    height: '0',
    padding: '0',
  },
});

const StyledTextField = styled(TextField)(stylesField as CreateCSSProperties);

const truncateNumber = (str: string, zeroLength: number | undefined) => {
  zeroLength = zeroLength !== undefined ? zeroLength : 0;
  const indexOfPoint = str.indexOf('.');
  if (indexOfPoint !== -1 && str.length >= indexOfPoint + zeroLength + 1) {
    str = str.slice(0, indexOfPoint + zeroLength + 1);
  }
  return str;
};

class NumField extends Component<NumFieldProps, NumFieldState> {
  private readonly inputRef: React.RefObject<HTMLInputElement>;
  errorMsgRef: RefObject<HTMLParagraphElement>;
  constructor(props: NumFieldProps) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      error: '',
      isError: false,
    };
    this.errorMsgRef = React.createRef();
  }
  syncUpData = (value: number | null) => {
    const errorType = this.checkError(value);
    const {
      onChange,
      maxRange,
      minRange,
      zeroLength,
      defaultValueWhenBlank,
      exceptionMax,
    } = this.props;
    if (onChange) {
      let num;
      if (value !== null) {
        num = Number(value.toFixed(zeroLength || 0));
        if (exceptionMax !== undefined && value === exceptionMax) {
          num = Number(exceptionMax.toFixed(zeroLength || 0));
        } else if (maxRange !== undefined && value > maxRange) {
          num = Number(
            (exceptionMax !== undefined ? exceptionMax : maxRange).toFixed(
              zeroLength || 0,
            ),
          );
        }
        if (minRange !== undefined && value < minRange) {
          num = Number(minRange.toFixed(zeroLength || 0));
        }
      } else {
        num = defaultValueWhenBlank ?? value;
      }
      onChange(num);
    }
    this.sendErrorToParent(errorType);
  };
  sendErrorToParent = (errorType: ERROR_TYPE | null) => {
    if (this.props.onError) {
      const errorStr = this.props.onError(errorType);
      this.setState({ error: errorStr, isError: errorType !== null });
    } else {
      this.setState({ isError: errorType !== null });
    }
  };
  smallerThanMin = (value: number) => {
    const { min } = this.props;
    let { minExclusive } = this.props;
    minExclusive = minExclusive !== undefined ? minExclusive : false;
    if (min === undefined) {
      return false;
    }
    if (minExclusive) {
      return value <= min;
    } else {
      return value < min;
    }
  };
  greaterThanMax = (value: number) => {
    const { max } = this.props;
    let { maxExclusive } = this.props;
    maxExclusive = maxExclusive !== undefined ? maxExclusive : false;
    if (max === undefined) {
      return false;
    }
    if (maxExclusive) {
      return value >= max;
    } else {
      return value > max;
    }
  };

  greateThanRobotPayload = (value: number) => {
    const { remainRobotPayload } = this.props;
    if (remainRobotPayload === undefined) {
      return false;
    }
    return value > remainRobotPayload;
  };

  checkError = (value: number | null): ERROR_TYPE | null => {
    let error: ERROR_TYPE | null = null;
    if (value !== null) {
      if (this.greateThanRobotPayload(value)) {
        error = OUT_OF_ROBOT_PAYLOAD;
      } else if (this.smallerThanMin(value) || this.greaterThanMax(value)) {
        error = OUT_OF_RANGE;
      }
    } else if (value === null && value !== undefined) {
      error = EMPTY;
    }
    if (this.errorMsgRef.current) {
      const heightWindow = window.innerHeight;
      //Height for header app (30px) + header tab (38px)
      const heightHeader = 68;
      const isElementEclipse =
        heightWindow -
          heightHeader -
          this.errorMsgRef.current.getBoundingClientRect().bottom <
        0;
      if (isElementEclipse) {
        scrollToEndElement(this.errorMsgRef.current);
      }
    }
    return error;
  };
  validateData = (value: string) => {
    value = truncateNumber(value, this.props.zeroLength);
    const numValue: number | null = this.parseNumber(value);
    if (value !== '-' && value !== undefined) {
      this.syncUpData(numValue);
    }
  };
  handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = e.target;
    const inputs = [],
      numRegex = /\d/;
    let canAddDot = false,
      dotted = false,
      hasStrangeChar = false,
      position = 0;
    for (let i = 0; i < value.length; i++) {
      const c = value.charAt(i);
      if (numRegex.test(c)) {
        inputs.push(c);
        canAddDot = this.props.allowDot ?? true;
      } else if (c === '-' && i === 0 && (this.props.allowNegative ?? true)) {
        inputs.push(c);
      } else if (c === '.' && !dotted && canAddDot) {
        canAddDot = false;
        dotted = true;
        inputs.push(c);
      } else {
        position = inputs.length;
        hasStrangeChar = true;
      }
    }
    if (!hasStrangeChar) {
      position = selectionStart || position;
    }
    e.target.value = inputs.join('');
    e.target.selectionStart = position;
    e.target.selectionEnd = position;
    this.validateData(e.target.value);
  };
  handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    let { value } = e.target;
    const {
      zeroLength,
      maxRange,
      minRange,
      defaultValueWhenBlank,
      exceptionMax,
    } = this.props;
    value = truncateNumber(value, zeroLength);
    const numValue = this.parseNumber(value);
    this.syncUpData(numValue);
    if (this.inputRef.current) {
      let inputValue;
      if (numValue !== null) {
        const zeroLength = this.getRemainZeroLength(numValue);
        inputValue = numValue.toFixed(zeroLength);
        if (exceptionMax !== undefined && numValue === exceptionMax) {
          inputValue = exceptionMax.toFixed(zeroLength);
        } else if (maxRange !== undefined && numValue > maxRange) {
          inputValue = (
            exceptionMax !== undefined ? exceptionMax : maxRange
          ).toFixed(zeroLength);
        }
        if (minRange !== undefined && numValue < minRange) {
          inputValue = minRange.toFixed(zeroLength);
        }
      } else {
        inputValue =
          defaultValueWhenBlank !== undefined
            ? defaultValueWhenBlank.toFixed(zeroLength || 0)
            : '';
      }
      this.inputRef.current.value = inputValue;
    }
  };
  parseNumber = (numStr: string): number | null => {
    let numValue;
    if (numStr === '.' || numStr === '-.') {
      numValue = 0;
    } else if (numStr === '') {
      numValue = null;
    } else if (!Number.isNaN(Number(numStr))) {
      numValue = Number(numStr);
    } else {
      numValue = null;
    }
    return numValue;
  };
  componentDidUpdate(prevProps: NumFieldProps) {
    if (
      (prevProps.value !== this.props.value &&
        this.inputRef.current &&
        this.inputRef.current !== document.activeElement) ||
      prevProps.zeroLength !== this.props.zeroLength
    ) {
      const newValue = this.updateInputElement(this.props.value);
      if (newValue !== undefined) {
        this.syncUpData(newValue);
      } else {
        this.setState({ isError: false, error: '' });
        if (this.props.onError) {
          this.props.onError(null);
        }
      }
    }
    const object1 = [
      this.props.min,
      this.props.minExclusive,
      this.props.max,
      this.props.maxExclusive,
      this.props.remainRobotPayload,
    ];
    const object2 = [
      prevProps.min,
      prevProps.minExclusive,
      prevProps.max,
      prevProps.maxExclusive,
      prevProps.remainRobotPayload,
    ];
    if (this.inputRef.current && !deepCompareEqual(object1, object2)) {
      let numb = null;
      if (this.inputRef.current.value) {
        numb = parseFloat(this.inputRef.current.value);
      }
      const errorType = this.checkError(numb);
      this.sendErrorToParent(errorType);
    }
  }
  shouldComponentUpdate(nextProps: NumFieldProps, nextState: NumFieldState) {
    if (
      this.props.value !== nextProps.value &&
      this.inputRef.current !== document.activeElement
    ) {
      return true;
    }
    const object1 = [
      this.props.label,
      this.props.disabled,
      this.props.startAdorment,
      this.props.endAdorment,
      this.props.min,
      this.props.minExclusive,
      this.props.max,
      this.props.maxExclusive,
      this.props.zeroLength,
      this.state.error,
      this.state.isError,
      this.props.error,
      this.props.remainRobotPayload,
      this.props.zeroLength,
    ];
    const object2 = [
      nextProps.label,
      nextProps.disabled,
      nextProps.startAdorment,
      nextProps.endAdorment,
      nextProps.min,
      nextProps.minExclusive,
      nextProps.max,
      nextProps.maxExclusive,
      nextProps.zeroLength,
      nextState.error,
      nextState.isError,
      nextProps.error,
      nextProps.remainRobotPayload,
      nextProps.zeroLength,
    ];
    return !deepCompareEqual(object1, object2);
  }
  componentDidMount() {
    if (this.props.value !== undefined) {
      this.syncUpData(this.props.value);
    } else {
      this.setState({ isError: false, error: '' });
    }
    this.updateInputElement(this.props.value);
  }
  getRemainZeroLength = (currentValue: number) => {
    currentValue = parseInt(currentValue.toString());
    let zeroLength;
    if (this.props.zeroLength) {
      zeroLength = this.props.zeroLength;
    } else {
      zeroLength = 0;
    }
    const maxLength = this.props.maxDigitLength
      ? this.props.maxDigitLength
      : INPUT_MAX_LENGTH;
    if (zeroLength + 1 > maxLength - currentValue.toString().length) {
      zeroLength = maxLength - currentValue.toString().length - 1;
    }
    if (zeroLength < 0) {
      zeroLength = 0;
    }
    return zeroLength;
  };
  updateInputElement = (value: null | undefined | number) => {
    if (this.inputRef.current) {
      if (value !== null && value !== undefined) {
        const zeroLength = this.getRemainZeroLength(value);
        const newValue =
          Number(value.toFixed(zeroLength)) === Number(-0) ? 0 : value;
        this.inputRef.current.value = newValue.toFixed(zeroLength);
        return parseFloat(value.toFixed(zeroLength));
      } else {
        this.inputRef.current.value = '';
        return value;
      }
    }
    return value;
  };
  checkErrorTextField = (
    propsDisabled: boolean | undefined,
    propsShowError: boolean,
    propsError: boolean,
    stateIsError: boolean,
  ) => {
    return !propsDisabled && propsShowError && (propsError || stateIsError);
  };

  render() {
    const {
      label,
      disabled,
      startAdorment,
      endAdorment,
      customProps,
      error = false,
      showError = true,
    } = this.props;

    const cssInput: React.CSSProperties = {};
    let adormentStartElement = <></>;
    if (startAdorment) {
      cssInput.paddingLeft = '0px';
      adormentStartElement = (
        <StyledInputAdornment position="start" disablePointerEvents>
          {startAdorment}
        </StyledInputAdornment>
      );
    } else {
      cssInput.paddingLeft = '8px';
    }
    let endAdornmentElement = <></>;
    if (endAdorment) {
      cssInput.paddingRight = '0px';
      endAdornmentElement = (
        <InputAdornment
          position="end"
          sx={{ paddingLeft: '4px !important' }}
          disablePointerEvents
        >
          {endAdorment}
        </InputAdornment>
      );
    } else {
      cssInput.paddingRight = '8px';
    }
    return (
      <>
        <StyledTextField
          sx={{
            '& .MuiInputBase-input': {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            pointerEvents: disabled ? 'none' : '',
          }}
          className={this.props.className}
          style={this.props.style}
          label={label}
          error={this.checkErrorTextField(
            disabled,
            showError,
            error,
            this.state.isError,
          )}
          disabled={disabled}
          fullWidth={true}
          type={'tel'}
          InputProps={{
            startAdornment: adormentStartElement,
            endAdornment: endAdornmentElement,
            tabIndex: -1,
          }}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          inputRef={this.inputRef}
          inputProps={{
            maxLength: this.props.maxDigitLength
              ? this.props.maxDigitLength
              : INPUT_MAX_LENGTH,
            style: {
              textAlign: `${this.props.textAlign ?? 'right'}`,
              fontWeight: '300',
              ...cssInput,
            },
          }}
          {...customProps}
        />
        {this.state.error.length > 0 && !disabled && (
          <FormHelperText error={true} ref={this.errorMsgRef}>
            {this.state.error}
          </FormHelperText>
        )}
      </>
    );
  }
}

export default NumField;

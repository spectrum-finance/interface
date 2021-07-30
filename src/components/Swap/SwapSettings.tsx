import React from 'react';
import { Grid, Input, Text, Popover, Button, Spacer } from '@geist-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { SlippageInput } from '../Settings/SlippageInput';
import { Field, FieldRenderProps } from 'react-final-form';
import { validateNumber } from './validation';
import {
  ERG_DECIMALS,
  ERG_TOKEN_NAME,
  NITRO_DECIMALS,
} from '../../constants/erg';
import InfoTooltip from '../common/InfoTooltip/InfoTooltip';
import { renderFractions, parseUserInputToFractions } from '../../utils/math';
import { toFloat } from '../../utils/string';
import { isZero } from '../../utils/numbers';

type SwapSettingsProps = {
  slippage: string;
  minDexFee: string;
  nitro: string;
  onChangeSlippage: (value: string) => void;
  onChangeMinDexFee: (value: string) => void;
  onChangeNitro: (value: string) => void;
};

const content = {
  slippage: {
    label: 'Slippage tolerance',
  },
};

const SwapSettings = ({
  slippage,
  minDexFee,
  nitro,
  onChangeSlippage,
  onChangeMinDexFee,
  onChangeNitro,
}: SwapSettingsProps): JSX.Element => {
  return (
    <Popover
      placement="bottomEnd"
      offset={2}
      hideArrow
      content={
        <div style={{ padding: '10px 20px', textAlign: 'start' }}>
          <Grid xs={24}>
            <Text h5>
              {content.slippage.label}{' '}
              <InfoTooltip
                text={
                  <>
                    Your transaction will revert if the <br /> price changes
                    unfavorably by more than <br />
                    this percentage.
                  </>
                }
              />
            </Text>
          </Grid>
          <Grid xs={24}>
            <SlippageInput slippage={slippage} setSlippage={onChangeSlippage} />
          </Grid>
          <Spacer y={1} />
          <Grid xs={24}>
            <Text h5>Advanced settings</Text>
          </Grid>
          <Grid xs={24}>
            <Text h6>
              Minimal DEX fee <InfoTooltip text="Minimal fee charged by DEX" />
            </Text>
          </Grid>
          <Grid xs={24}>
            <Field
              name="minDexFee"
              validate={(value) => {
                return validateNumber(value, {
                  maxDecimals: ERG_DECIMALS,
                });
              }}
            >
              {(props: FieldRenderProps<string>) => (
                <Input
                  placeholder="0.0"
                  width="100%"
                  label={ERG_TOKEN_NAME}
                  {...props.input}
                  value={
                    Number(minDexFee) === 0
                      ? minDexFee
                      : renderFractions(BigInt(minDexFee), ERG_DECIMALS)
                  }
                  onChange={({ currentTarget }) => {
                    const value = toFloat(currentTarget.value, ERG_DECIMALS);

                    if (!isZero(value)) {
                      const valueFractions = String(
                        parseUserInputToFractions(value, ERG_DECIMALS),
                      );

                      onChangeMinDexFee(valueFractions);
                    } else {
                      onChangeMinDexFee(value);
                    }
                  }}
                />
              )}
            </Field>
          </Grid>
          <Grid xs={24}>
            <Text h6>
              Nitro <InfoTooltip text="Maximum DEX fee multiplier" />
            </Text>
          </Grid>
          <Grid xs={24}>
            <Field
              name="nitro"
              validate={(value) => {
                return validateNumber(value, { maxDecimals: NITRO_DECIMALS });
              }}
            >
              {(props: FieldRenderProps<string>) => (
                <Input
                  placeholder="0.0"
                  width="100%"
                  {...props.input}
                  value={nitro}
                  onChange={({ currentTarget }) => {
                    const value = toFloat(currentTarget.value);
                    onChangeNitro(value);
                    props.input.onChange(currentTarget.value as string);
                  }}
                />
              )}
            </Field>
          </Grid>
        </div>
      }
    >
      <Button
        auto
        type="abort"
        icon={<FontAwesomeIcon icon={faCog} size="lg" />}
      />
    </Popover>
  );
};

export default SwapSettings;

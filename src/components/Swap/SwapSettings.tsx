import { faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Grid,
  Input,
  Popover,
  Row,
  Spacer,
  Text,
} from '@geist-ui/react';
import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';

import {
  ERG_DECIMALS,
  ERG_TOKEN_NAME,
  MIN_EX_FEE,
  MIN_NITRO,
  NITRO_DECIMALS,
} from '../../constants/erg';
import { parseUserInputToFractions, renderFractions } from '../../utils/math';
import { isZero } from '../../utils/numbers';
import { toFloat } from '../../utils/string';
import InfoTooltip from '../common/InfoTooltip/InfoTooltip';
import { SlippageInput } from '../Settings/SlippageInput';
import { validateMinDexFee, validateNitro } from './validation';

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
                return validateMinDexFee(value);
              }}
            >
              {(props: FieldRenderProps<string>) => (
                <>
                  <Row>
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
                        const value = toFloat(
                          currentTarget.value,
                          ERG_DECIMALS,
                        );

                        if (!isZero(value)) {
                          const valueFractions = String(
                            parseUserInputToFractions(value, ERG_DECIMALS),
                          );

                          onChangeMinDexFee(valueFractions);
                        } else {
                          onChangeMinDexFee(value);
                        }
                        props.input.onChange(currentTarget.value as string);
                      }}
                      onBlur={() => {
                        if (
                          !minDexFee ||
                          !minDexFee.trim() ||
                          validateMinDexFee(minDexFee)
                        ) {
                          onChangeMinDexFee(String(MIN_EX_FEE));
                          props.input.onChange(MIN_EX_FEE);
                        }
                      }}
                    />
                  </Row>
                  {props.meta.error && (
                    <Text small type="error">
                      {props.meta.error}
                    </Text>
                  )}
                </>
              )}
            </Field>
          </Grid>
          <Spacer y={1} />
          <Grid xs={24}>
            <Text h6>
              Nitro <InfoTooltip text="Maximum DEX fee multiplier" />
            </Text>
          </Grid>
          <Grid xs={24}>
            <Field
              name="nitro"
              validate={(value) => {
                return validateNitro(value);
              }}
            >
              {(props: FieldRenderProps<string>) => (
                <>
                  <Row>
                    <Input
                      placeholder="0.0"
                      width="100%"
                      {...props.input}
                      value={nitro}
                      onChange={({ currentTarget }) => {
                        const value = toFloat(
                          currentTarget.value,
                          NITRO_DECIMALS,
                        );
                        onChangeNitro(value);
                        props.input.onChange(currentTarget.value as string);
                      }}
                      onBlur={() => {
                        if (!nitro || !nitro.trim() || validateNitro(nitro)) {
                          onChangeNitro(String(MIN_NITRO));
                          props.input.onChange(MIN_NITRO);
                        }
                      }}
                    />
                  </Row>
                  {props.meta.error && (
                    <Text small type="error">
                      {props.meta.error}
                    </Text>
                  )}
                </>
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

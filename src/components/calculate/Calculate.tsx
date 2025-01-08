import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { parseUnits, formatUnits } from 'ethers';
import { ButtonCalculate, CalculateWrapper, Input } from './styled';
import { ButtonWithBg, FaqCol, FaqRow, Text16, Title20 } from '../../styled';
import { Row } from '../../utils';

// ВАЖНО: импортируем ваш Web3Context
import { Web3Context } from '../../WebProvider';

/** 
 * Пропы:
 *  - column?: boolean — верстка по колонкам
 *  - apyDecimal?: number — если захотите вручную задать APY как 0.40 (40%).
 *    Если не передан, компонент попытается загрузить APY из контракта.
 */
type Props = {
  column?: boolean;
  apyDecimal?: number;  // APY в виде десятичной дроби (напр. 0.40 => 40%)
};

export const Calculate = ({ column, apyDecimal }: Props) => {
  // 1. Достаём stakingContract из контекста
  const { stakingContract } = useContext(Web3Context);

  // 2. Состояния
  // Начальное значение инвестиций в $
  const [sum, setSum] = useState<number>(1000);

  // Кнопки выбора «будущей цены»: 0 => 0.01, 1 => 0.10, 2 => 1.00, 3 => 10.00
  const [selectPrice, setSelectPrice] = useState<number>(0);

  // массив будущих цен:
  const scenarioPrices = [0.01, 0.1, 1.0, 10.0];

  // Если apyDecimal не задан, мы будем хранить apy, загруженный из контракта
  const [apyFromContract, setApyFromContract] = useState<number>(0);

  // Текущее значение «фактического» APY (десятичное).
  // Берём либо apyDecimal (из пропсов), либо apyFromContract (из контракта).
  const actualApyDecimal = apyDecimal !== undefined ? apyDecimal : apyFromContract;

  /** 
   * Начальная цена (считаем, что пользователь покупает 
   * по $0.01 сейчас, если ваша логика другая — поменяйте)
   */
  const buyPrice = 0.01;

  // Подсчёт "Potential Profit"
  const [profit, setProfit] = useState<number>(0);

  // ===================== Хук для чтения APY из контракта =====================
  useEffect(() => {
    // Если пользователь передал apyDecimal prop, то ничего не грузим из контракта
    if (apyDecimal !== undefined) {
      return;
    }
    // Иначе пробуем получить APY из стейкинг-контракта
    if (!stakingContract) {
      // Контракта нет => оставим 0
      setApyFromContract(0);
      return;
    }

    const loadApy = async () => {
      try {
        // 1) totalStaked
        const rawStaked: bigint = await stakingContract.getTotalStaked();
        const stakedFloat = parseFloat(formatUnits(rawStaked, 18));

        // 2) dailyReward
        const rawDailyReward: bigint = await stakingContract.dailyReward();
        const dailyRewardFloat = parseFloat(formatUnits(rawDailyReward, 18));

        if (stakedFloat > 0) {
          const dailyFraction = dailyRewardFloat / stakedFloat;
          // APR
          const aprVal = dailyFraction * 365 * 100; 
          // APY c ежедневным компаундом
          const apyVal = (Math.pow(1 + dailyFraction, 365) - 1) * 100;

          // Сохраняем APY как десятичную дробь (0.40 => 40%)
          const apyDecimalFromChain = apyVal / 100;
          setApyFromContract(apyDecimalFromChain);
        } else {
          setApyFromContract(0);
        }
      } catch (err) {
        console.error('Error loading APY from contract:', err);
        setApyFromContract(0);
      }
    };
    loadApy();
  }, [stakingContract, apyDecimal]);

  // ===================== Функция пересчёта =====================
  const recalcProfit = (inv: number, scenarioIndex: number) => {
    // scenarioPrice:
    const scenarioPrice = scenarioPrices[scenarioIndex];

    // Кол-во токенов, купленных за `inv` долларов по buyPrice
    const tokensInitial = inv / buyPrice;
    // С учётом годового APY => умножаем на (1 + actualApyDecimal)
    const tokensFinal = tokensInitial * (1 + actualApyDecimal);

    // итоговая стоимость, если продать по scenarioPrice
    const finalValue = tokensFinal * scenarioPrice;

    // Potential Profit = finalValue - inv
    const profitVal = finalValue - inv;
    return profitVal;
  };

  // При изменении суммы
  const handleSumChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (Number.isNaN(value)) return;

    setSum(value);

    // Пересчитаем profit
    const pf = recalcProfit(value, selectPrice);
    setProfit(pf);
  };

  // При переключении кнопки
  const handlePriceClick = (idx: number) => {
    setSelectPrice(idx);
    // Пересчитываем
    const pf = recalcProfit(sum, idx);
    setProfit(pf);
  };

  // Кнопка «Calculate» (если нужна ручная)
  const handleCalculate = () => {
    const pf = recalcProfit(sum, selectPrice);
    setProfit(pf);
  };

  // ===================== Рендер =====================
  return (
    <CalculateWrapper>
      <Title20>
        <span>Discover your potential short-term profits</span>
      </Title20>

      {/* Кнопки выбора будущей цены */}
      <Row style={{ gap: "0px", justifyContent: "space-between" }}>
        <ButtonWithBg
          bgColor={selectPrice === 0 ? "#FE8903" : '#FE890399'}
          onClick={() => handlePriceClick(0)}
        >
          <Text16>Current Price ($0.01)</Text16>
        </ButtonWithBg>

        <ButtonWithBg
          bgColor={selectPrice === 1 ? "#FE8903" : '#FE890399'}
          onClick={() => handlePriceClick(1)}
        >
          <Text16>Launch Price ($0.10)</Text16>
        </ButtonWithBg>

        <ButtonWithBg
          bgColor={selectPrice === 2 ? "#FE8903" : '#FE890399'}
          onClick={() => handlePriceClick(2)}
        >
          <Text16>Mid-Term ($1.00)</Text16>
        </ButtonWithBg>

        <ButtonWithBg
          bgColor={selectPrice === 3 ? "#FE8903" : '#FE890399'}
          onClick={() => handlePriceClick(3)}
        >
          <Text16>Long-Term ($10.00)</Text16>
        </ButtonWithBg>
      </Row>

      <FaqRow column={column}>
        {/* Поле "Initial Investment" */}
        <FaqCol column={column}>
          <Text16 center={!column}>Initial Investment (USD)</Text16>
          <Input bg="transparent">
            <span>$</span>
            <input
              type="number"
              inputMode="numeric"
              value={sum}
              onChange={handleSumChange}
            />
          </Input>
        </FaqCol>

        {/* Поле "Potential Profit" */}
        <FaqCol column={column}>
          <Text16 center={!column}>
            {/* (actualApyDecimal * 100) => процент APY */}
            Potential Profit ({(actualApyDecimal * 100).toFixed(0)}% APY)
          </Text16>
          <Input bg="#20C95480">
            <span>$</span>
            {/* Округлим до 2 знаков */}
            <input readOnly value={profit.toFixed(2)} />
          </Input>
        </FaqCol>
      </FaqRow>

      {/* Кнопка - если хотите ручной пересчёт */}
      <ButtonCalculate onClick={handleCalculate}>Calculate</ButtonCalculate>
    </CalculateWrapper>
  );
};

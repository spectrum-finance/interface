import styled from 'styled-components';

import { RightSideCoinList } from './RightSideCoinList';

const MainContainer = styled('div')`
  padding: 0 1rem;
`;

const Container = styled('div')`
  max-width: 1400px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 338px;
  gap: 2rem;
`;

const LeftSideContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TopChartsContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const Chart = styled('div')`
  height: 288px;
  background: var(--teddy-box-color);
  border-radius: 18px;
`;

const BottomChartsContainer = styled('div')`
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 2rem;
`;

const BottomChart = styled('div')`
  height: 232px;
  background: var(--teddy-box-color);
  border-radius: 18px;
`;

const LastCardsContainer = styled('div')`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const Dashboard = () => {
  return (
    <MainContainer>
      <Container>
        <LeftSideContainer>
          <TopChartsContainer>
            <Chart>chart</Chart>
            <Chart>chart</Chart>
          </TopChartsContainer>
          <BottomChartsContainer>
            <BottomChart>123</BottomChart>
            <BottomChart>123</BottomChart>
          </BottomChartsContainer>
          <LastCardsContainer>
            <BottomChart>123</BottomChart>
            <BottomChart>123</BottomChart>
          </LastCardsContainer>
        </LeftSideContainer>
        <RightSideCoinList />
      </Container>
    </MainContainer>
  );
};

export default Dashboard;

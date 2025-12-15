import BarChart from '@/components/BarChart/BarChart';
import Page from '@/components/layout/Page/Page';

const HomePage = (): React.ReactNode => {
  return (
    <Page>
      <h2>Диаграмма пользователей</h2>

      <BarChart
        dimensions={{ width: 700, height: 450 }}
        color="steelblue"
      />
    </Page>
  );
};

export default HomePage;

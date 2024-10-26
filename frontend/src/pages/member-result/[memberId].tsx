import { Layout } from "common/shared/ui/layout";
import { GoBackButton } from "common/shared/ui/go-back-btn";
import { ResultList } from "common/widgets/result-list";

const MemberEvaluationPage = () => {
  return (
    <Layout pageTitle="Результат">
      <GoBackButton />
      <ResultList />
    </Layout>
  );
};

export default MemberEvaluationPage;

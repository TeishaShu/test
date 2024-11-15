import ComCalPreview from '../../../components/ComCalPreview';

const cal_preview = props => {
  const {
    match,
  } = props;

  return (
    <ComCalPreview
      uiType="righ"
      pageId={match.params.id}
    />
  );
}

export default cal_preview;
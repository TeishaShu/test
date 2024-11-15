import ComCalPreview from '../../../components/ComCalPreview';

const cal_preview = props => {
  const {
    match,
  } = props;

  return (
    <ComCalPreview
      uiType="reco"
      pageId={match.params.id}
      pageSouvId={match.params.souvid}
    />
  );
}

export default cal_preview;
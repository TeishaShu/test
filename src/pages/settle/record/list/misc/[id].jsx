import ComMisc from '../../../components/ComMisc';

export const RecordMisc = props => {
  const {
    match,
  } = props;

  return (
    < ComMisc
      pageId={match.params.id}
      phase_type_state="2"
    />
  );
}

export default RecordMisc;

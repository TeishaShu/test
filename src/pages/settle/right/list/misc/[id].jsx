import ComMisc from '../../../components/ComMisc';

export const RightMisc = props => {
  const {
    match,
  } = props;

  return (
    < ComMisc
      pageId={match.params.id}
      phase_type_state="1"
    />
  );
}

export default RightMisc;

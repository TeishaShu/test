import ComAlbumPrepaidException from '../../../components/ComAlbumPrepaidException';

const album_exception = props => {
  const {
    match,
  } = props;

  return (
    <ComAlbumPrepaidException
      prepaidType="reco"
      pageId={match.params.id}
    />
  );
}

export default album_exception;
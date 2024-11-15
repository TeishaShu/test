import ComAlbumPrepaidOs from '../../../components/ComAlbumPrepaidOs';

const album_os = props => {
  const {
    match,
  } = props;

  return (
    <ComAlbumPrepaidOs
      prepaidType="reco"
      pageId={match.params.id}
    />
  );
}

export default album_os;
import ComAlbumPrepaidExt from '../../../components/ComAlbumPrepaidExt';

const album_ext = props => {
  const {
    match,
  } = props;

  return (
    <ComAlbumPrepaidExt
      prepaidType="reco"
      pageId={match.params.id}
    />
  );
}

export default album_ext;
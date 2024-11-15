import ComAlbumPrepaidTw from '../../../components/ComAlbumPrepaidTw';

const album_tw = props => {
  const {
    match,
  } = props;

  return (
    <ComAlbumPrepaidTw
      prepaidType="righ"
      pageId={match.params.id}
    />
  );
}

export default album_tw;
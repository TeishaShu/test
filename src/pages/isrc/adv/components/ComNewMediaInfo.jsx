import {
  Table,
} from 'antd';
import { connect } from 'umi';

export const ComNewMediaInfo = props => {
  const {
    isrcList: { info, songMedia },
  } = props;

  // ui -----
  const columns = [
    {
      title: '平台',
      dataIndex: 'company_name',
      key: 'company_name',
    },
    {
      title: '平台歌編',
      dataIndex: 'media_song_code',
      key: 'media_song_code',
    },
    {
      title: '歌名',
      dataIndex: 'media_song_name',
      key: 'media_song_name',
    },
  ];

  return (
    <Table
      pagination={false}
      loading={false}
      columns={columns}
      dataSource={(info.isrc && songMedia && songMedia.data_list) ? (songMedia.data_list) : ([])}
      rowKey="id"
    />
  );
}

export default connect(({ isrcList, loading }) => ({
  isrcList,
}))(ComNewMediaInfo);
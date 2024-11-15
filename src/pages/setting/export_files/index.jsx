import {
  Row,
  Col,
  Card,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ComDownloadLink from './components/ComDownloadLink';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

const export_files = props => {
  const nowTime = commFn.getNowTime();

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row>
          <Col
            xs={24}
            className={styles.om_overflow_auto}
          >
            <table className={styles.formTable}>
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th style={{ width: '200px' }}>類型</th>
                  <th style={{ width: '500px' }}>內容</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                  <td><p className={styles.om_m_b_24}>詞曲歌單</p></td>
                  <td><p className={styles.om_m_b_24}>全部權利+無OP/SP/結算對象</p></td>
                  <td><ComDownloadLink path={`${window.FRONTEND_WEB}/Song/export_songlist?main=song&type=export&file_name=詞曲歌單_全部權利無OP_${nowTime}`} /></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td><p className={styles.om_m_b_24}>我方權利+無OP/SP/結算對象</p></td>
                  <td><ComDownloadLink path={`${window.FRONTEND_WEB}/Song/export_songlist?main=song&type=export&is_default_company=1&file_name=詞曲歌單_我方權利無OP_${nowTime}`} /></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td><p className={styles.om_m_b_24}>實體的全部權利+有OP/SP/結算對象</p></td>
                  <td><ComDownloadLink path={`${window.FRONTEND_WEB}/Song/export_songlist?main=song&type=export_all&is_entity=1&file_name=詞曲歌單_實體全部權利有OP_${nowTime}`} /></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td><p className={styles.om_m_b_24}>實體的我方權利+有OP/SP/結算對象</p></td>
                  <td><ComDownloadLink path={`${window.FRONTEND_WEB}/Song/export_songlist?main=song&type=export_all&is_entity=1&is_default_company=1&file_name=詞曲歌單_實體我方權利有OP_${nowTime}`} /></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td><p className={styles.om_m_b_24}>數位的全部權利+有OP/SP/結算對象</p></td>
                  <td><ComDownloadLink path={`${window.FRONTEND_WEB}/Song/export_songlist?main=song&type=export_all&is_digital=1&file_name=詞曲歌單_數位全部權利有OP_${nowTime}`} /></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td><p className={styles.om_m_b_24}>數位的我方權利+有OP/SP/結算對象</p></td>
                  <td><ComDownloadLink path={`${window.FRONTEND_WEB}/Song/export_songlist?main=song&type=export_all&is_digital=1&is_default_company=1&file_name=詞曲歌單_數位我方權利有OP_${nowTime}`} /></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td><p className={styles.om_m_b_24}>錄音歌單</p></td>
                  <td><p className={styles.om_m_b_24}>錄音歌單</p></td>
                  <td><ComDownloadLink path={`${window.FRONTEND_WEB}/Song/export_songlist?main=isrc&type=export&file_name=錄音歌單_${nowTime}`} /></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td><p className={styles.om_m_b_24}>錄音+全部權利,無OP/SP/結算對象</p></td>
                  <td><ComDownloadLink path={`${window.FRONTEND_WEB}/Song/export_songlist?main=isrc&type=export_all&file_name=錄音歌單_全部權利無OP_${nowTime}`} /></td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper >
  );
}

export default export_files;
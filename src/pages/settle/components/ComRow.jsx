import { UnorderedListOutlined, CloseOutlined, ImportOutlined, } from '@ant-design/icons';
import {
  Tooltip,
  Button,
} from 'antd';
import { history, connect } from 'umi';
import styles from '@/style/style.less';

const ComRow = props => {
  const {
    uiType,
    isName,
    fileName,
    fileListId,  // optional
    row,
    selectSettlePhaseId,  // optional
    selectSouvSettlePhaseId,  // optional
    importInfo,  // optional
    handleDelete,  // optional
  } = props;

  return (
    <tr>
      <td><p>{fileName}</p></td>
      <td>
        <p>
          {
            (handleDelete) && (
              <Tooltip title="匯入檔案">
                <ImportOutlined
                  className={styles.om_icon_style}
                  onClick={() => {
                    importInfo(fileListId, (isName == 'souv') ? 'souv' : uiType);
                  }}
                />
              </Tooltip>
            )
          }
        </p>
      </td>
      <td><p>{row}</p></td>
      <td>
        <p>
          <Tooltip title="查看清單">
            <UnorderedListOutlined
              className={styles.om_icon_style}
              onClick={() => {
                if (isName == 'new_media') {
                  history.push(`/settle/${(uiType == 'righ') ? ('right') : ('record')}/newmedia`);
                } else if (isName == 'tw' || isName == 'ext' || isName == 'os') {
                  window.open(`${REACT_APP_PUBLIC_PATH}/#/settle/${(uiType == 'righ') ? ('right') : ('record')}/list/album_${isName}/${selectSettlePhaseId}`, '_blank');
                } else if (isName == 'misc') {
                  window.open(`${REACT_APP_PUBLIC_PATH}/#/settle/${(uiType == 'righ') ? ('right') : ('record')}/list/misc/${selectSettlePhaseId}`, '_blank');
                } else if (isName == 'souv') {
                  window.open(`${REACT_APP_PUBLIC_PATH}/#/settle/record/list/settle_souvenir/${selectSouvSettlePhaseId}/file_list/${fileListId}`, '_blank');
                }
              }}
            />
          </Tooltip>
        </p>
      </td>
      <td>
        <p>
          {
            (handleDelete) && (
              <Tooltip title="刪除">
                <CloseOutlined
                  className={`${styles.om_icon_style} ${styles.om_color_red}`}
                  onClick={() => {
                    handleDelete(fileListId, (isName == 'souv') ? true : false);
                  }}
                />
              </Tooltip>
            )
          }
        </p>
      </td>
    </tr>
  );
}

export default ComRow;
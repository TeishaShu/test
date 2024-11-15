import React, { Fragment } from 'react';
import {
  Button,
  Tooltip,
} from 'antd';
import { CloseOutlined, } from '@ant-design/icons';
import styles from '@/style/style.less';

const ComSettlement = props => {
  const { cusStyles,
    settleData,
    titleStyle,
    rightApplyAlbumPrepaid,
    rightApplyReplaceSettlement,
    rightUnApplyAlbumPrepaid,
    rightUnapplyReplaceSettlement,
    recoApplyReplaceSettlement,
    recoUnapplyReplaceSettlement,
  } = props;

  const handleClickApply = (title) => {
    // 詞曲-套用(專輯預付扣抵)
    if (titleStyle === "right") {
      if (title === '專輯預付扣抵') {
        rightApplyAlbumPrepaid();
      } else if (title === '代結算拆分報表') {
        rightApplyReplaceSettlement();
      } else if (title === '合約預付扣抵') {
        console.log('right 合約預付扣抵')
      }
    } else {
      if (title === '代結算拆分報表') {
        recoApplyReplaceSettlement();
      } else if (title === '合約預付扣抵') {
        console.log('reco 合約預付扣抵')
      }
    }
  }

  const handleClickDelete = (title) => {
    // 詞曲-套用(專輯預付扣抵)
    if (titleStyle === "right") {
      if (title === '專輯預付扣抵') {
        rightUnApplyAlbumPrepaid();
      } else if (title === '代結算拆分報表') {
        rightUnapplyReplaceSettlement();
      } else if (title === '合約預付扣抵') {
        console.log('right 合約預付扣抵')
      }
    } else {
      if (title === '代結算拆分報表') {
        recoUnapplyReplaceSettlement();
      } else if (title === '合約預付扣抵') {
        console.log('reco 合約預付扣抵')
      }
    }
  }

  return (
    <table style={cusStyles.table}>
      <tbody>
        {settleData.map((item, index) => (
          (<Fragment key={index}>
            <tr>
              <td><p style={cusStyles.subTitle}>{item.title}</p></td>
              <td><p>{item.data}</p></td>
              <td style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  className={styles.om_sp_m_lb}
                  style={{ margin: '0' }}
                  disabled={!item.isApply}
                  onClick={() => handleClickApply(item.title)}
                  key={index}
                >
                  套用
                </Button>

                <Tooltip title="刪除">
                  <CloseOutlined style={{ marginLeft: '30px', marginRight: '30px', visibility: (item.hadDelete) ? 'unset' : 'hidden' }}
                    className={`${styles.om_icon_style} ${styles.om_color_red}`}
                    onClick={() => handleClickDelete(item.title)}
                  />
                </Tooltip>
              </td>
            </tr>
            <tr>
              <td colSpan="3">
                <div className={styles.contentBBd}></div>
              </td>
            </tr>
          </Fragment>)
        ))}
      </tbody>
    </table>
  )
}

// export default ComSettlement;
export default ComSettlement;
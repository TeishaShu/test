import { DownloadOutlined } from '@ant-design/icons';
import styles from '@/style/style.less';

const ComDownloadLink = props => {
  const {
    path
  } = props;

  return (
    <a
      href={path}
      target="_blank"
    >
      <DownloadOutlined
        className={`${styles.om_icon_style} ${styles.om_color_link_blue}`}
      />
    </a>
  );
}

export default ComDownloadLink;
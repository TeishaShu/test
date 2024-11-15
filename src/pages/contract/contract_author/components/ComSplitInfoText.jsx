import styles from '@/style/style.less';

const ComSplitInfoText = props => {
  return (
    <div style={{ padding: '15px', backgroundColor: '#FFF3D7' }}>
      <p>數字標示說明：</p>
      <p>1. 數字<span className={styles.om_color_red}>不含符號</span> 45 代表該項目值直接分配 45 元。 = 銷售量 × 45元</p>
      <p>2. 數字含 <span className={styles.om_color_red}>%</span>。30% 代表該項目為淨收入 30%。 = 淨收入 × 30%</p>
      <p>3. 數字含 <span className={styles.om_color_red}>#</span>。15# 代表該項目為銷售 65 淨收 15%。 = 售價 ÷ 1.05 × 15% × 65%</p>
      <p>4. 數字含 <span className={styles.om_color_red}>Q</span>。35Q 代表該項目為銷售 80 淨收 35%。 = 售價 ÷ 1.05 × 35% × 80%</p>
      <p>5. 數字含 <span className={styles.om_color_red}>*</span>。50* 代表該項目為批發價 50%。 = 售價 ÷ 1.05 × 50%</p>
      <p>6. 數字含 <span className={styles.om_color_red}>^</span>。20^ 代表該項目為零售價 20%。 = 售價 × 20%</p>
    </div>
  );
}

export default ComSplitInfoText;
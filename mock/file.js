function getDownload(req, res) {
  setTimeout(() => {
    return res.json({});
  }, 1000);
}

export default {
  'get  /file/download': getDownload,
};
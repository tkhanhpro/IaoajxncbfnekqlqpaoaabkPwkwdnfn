const express = require('express');
const router = express.Router();
const getVideoData = require('../utils/getVideoData');

router.get('/down', async (req, res) => {
  const { url } = req.query;

  // Kiểm tra URL
  if (!url) {
    console.warn('Missing URL in request');
    return res.status(400).json({
      success: false,
      message: 'Please provide a URL! 😜',
      data: null
    });
  }

  // Regex hỗ trợ tất cả link hợp lệ (bất kỳ domain nào)
  const validUrlPattern = /^(https?:\/\/)([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
  if (!validUrlPattern.test(url)) {
    console.warn(`Invalid URL format: ${url}`);
    return res.status(400).json({
      success: false,
      message: 'Link không được hỗ trợ 😎',
      data: null
    });
  }

  try {
    console.info(`Fetching media for URL: ${url}`);
    const data = await getVideoData(url);
    if (!data || data.error) {
      console.error(`Failed to fetch media: ${data?.error || 'Unknown error'}`);
      return res.status(400).json({
        success: false,
        message: data?.error || 'Couldn’t fetch the media. Try another link! 😿',
        data: null
      });
    }

    // Làm lại data trả về gọn gàng hơn
    const response = {
      success: true,
      message: 'Media fetched successfully! 🌟',
      data: {
        downloadLinks: data.medias ? data.medias.map(media => ({
          url: media.url,
          quality: media.quality || 'Default'
        })) : [],
        details: {
          title: data.title || 'Unknown',
          duration: data.duration || 'N/A',
          thumbnail: data.thumbnail || null
        }
      }
    };

    console.info(`Successfully fetched media for URL: ${url}`);
    return res.json(response);
  } catch (error) {
    console.error(`Server error for URL ${url}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Server error: ${error.message}. Try again later! 😵`,
      data: null
    });
  }
});

module.exports = router;

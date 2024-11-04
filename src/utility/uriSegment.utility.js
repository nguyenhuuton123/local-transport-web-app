export const getFirstURISegment = () => {
      // Kiểm tra xem có phải môi trường trình duyệt hay không
      if (typeof window !== 'undefined' && window.location.pathname) {
          let path = window.location.pathname;
          let segments = path.split("/");
          // Kiểm tra xem có đủ segment hay không
          if (segments.length > 1) {
              return segments[1];
          }
      }
      // Trả về null hoặc giá trị mặc định phù hợp trong trường hợp không tìm thấy segment
      return null;
  };
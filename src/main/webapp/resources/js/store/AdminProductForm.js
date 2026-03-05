document.addEventListener("DOMContentLoaded", function () {
  const ctx = window.__CTX__ || "";
  const tempKey = document.getElementById("tempKey").value;
  const imageInput = document.getElementById("imageInput");
  const imgPreviewList = document.getElementById("imgPreviewList");
  const btnSubmit = document.getElementById("btnSubmit");

  // 이미지 임시 업로드 및 미리보기
  imageInput.addEventListener("change", function () {
    const files = imageInput.files;
    if (files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      formData.append("tempKey", tempKey);

      fetch(`${ctx}/store/admin/product/uploadTemp`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            const img = document.createElement("img");
            img.src = `${ctx}/store/display?imgName=product_upload/_temp/${tempKey}/${data.savedName}`;
            img.className = "img-preview";
            imgPreviewList.appendChild(img);
          } else {
            alert("이미지 업로드에 실패했습니다.");
          }
        })
        .catch((err) => {
          console.error("Upload error:", err);
          alert("업로드 중 오류가 발생했습니다.");
        });
    }
  });

  // 최종 등록 버튼 클릭
  btnSubmit.addEventListener("click", function () {
    const form = document.getElementById("productForm");
    
    // 필수값 체크 (간단하게)
    if(!document.getElementById("productName").value){
        alert("상품명을 입력해주세요.");
        return;
    }

    const payload = {
      category_id: document.getElementById("categoryId").value,
      product_name: document.getElementById("productName").value,
      product_price: document.getElementById("productPrice").value || 0,
      product_delivery_price: document.getElementById("productDeliveryPrice").value || 0,
      product_remain: document.getElementById("productRemain").value || 0,
      product_description_brief: document.getElementById("productDescriptionBrief").value,
      product_description_detail: document.getElementById("productDescriptionDetail").value,
      product_caution: document.getElementById("productCaution").value,
      product_sale: document.getElementById("productSale").value || 0,
      tempKey: tempKey
    };

    fetch(`${ctx}/store/admin/product/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("상품이 성공적으로 등록되었습니다!");
          location.href = `${ctx}/store/product/detail?product_id=${data.productId}`;
        } else {
          alert("상품 등록에 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error("Submit error:", err);
        alert("등록 중 오류가 발생했습니다.");
      });
  });
});

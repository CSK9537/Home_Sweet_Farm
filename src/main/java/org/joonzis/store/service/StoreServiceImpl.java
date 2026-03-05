package org.joonzis.store.service;

import java.util.List;

import org.joonzis.store.dto.ProductDetailDTO;
import org.joonzis.store.dto.ProductForAdminListDTO;
import org.joonzis.store.dto.ProductForListDTO;
import org.joonzis.store.dto.ProductReviewDTO;
import org.joonzis.store.dto.SearchProductDTO;
import org.joonzis.store.mapper.ProductMapper;
import org.joonzis.store.mapper.ProductReviewMapper;
import org.joonzis.store.vo.ProductCategoryVO;
import org.joonzis.store.vo.ProductImageVO;
import org.joonzis.store.vo.ProductReviewVO;
import org.joonzis.store.vo.ProductVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import lombok.extern.log4j.Log4j;

@Log4j
@Service
public class StoreServiceImpl implements StoreService{
	@Autowired
	ProductMapper pMapper;
	@Autowired
	ProductReviewMapper rMapper;
	
	@Value("${hsf.upload.root:\\\\192.168.0.153\\\\projecthsf}")
	private String uploadRoot;

	private String today() {
		return new SimpleDateFormat("yyyyMMdd").format(new Date());
	}

	private String buildSaveDir() {
		return "review_upload/" + today();
	}

	private String buildTempDir(String tempKey) {
		return "review_upload/_temp/" + tempKey;
	}

	private String newSavedName(String originalName) {
		String ext = "";
		int idx = originalName.lastIndexOf('.');
		if (idx >= 0) ext = originalName.substring(idx);
		return UUID.randomUUID().toString().replace("-", "") + ext;
	}
	
	@Override
	public int addNewProduct(ProductVO vo) {
		int result = pMapper.insertProduct(vo);
		return result;
	}
	@Override
	public ProductVO getProductInfo(int product_id) {
		ProductVO vo = pMapper.getProduct(product_id);
		return vo;
	}
	@Override
	public List<ProductVO> getProductList() {
		return pMapper.getProductList();
	}
	// 상품 삭제시 연관되어 있는 리뷰들도 모두 삭제
	@Transactional
	@Override
	public int removeProduct(int product_id) {
		rMapper.deleteProductReviewByProductId(product_id);
		return pMapper.deleteProduct(product_id);
	}
	@Override
	public int updateProductInfo(ProductVO vo) {
		return pMapper.updateProduct(vo);
	}
	
	@Override
	public List<ProductForListDTO> getListByCategoryId(int category_id) {
		return pMapper.getProductListByCategoryId(category_id);
	}
	@Override
	public ProductDetailDTO getProductDetail(int product_id) {
		return pMapper.getProductDetail(product_id);
	}
	@Override
	public List<ProductForListDTO> getListOnSale() {
		return pMapper.getProductListOnSale();
	}
	@Override
	public List<ProductForListDTO> getListOnHot() {
		return pMapper.getProductListOnHot();
	}
	// 상품 리뷰 작성
	@Transactional
	@Override
	public int addProductReview(ProductReviewVO vo, String tempKey) throws DuplicateKeyException {
		// 1. 임시 파일을 실제 저장소로 이동
		if (tempKey != null && !tempKey.isEmpty()) {
			Path tempPath = Paths.get(uploadRoot, buildTempDir(tempKey));
			if (Files.exists(tempPath)) {
				Path savePath = Paths.get(uploadRoot, buildSaveDir());
				try {
					Files.createDirectories(savePath);
					
					File tempDir = tempPath.toFile();
					File[] files = tempDir.listFiles();
					StringBuilder imageList = new StringBuilder();
					
					if (files != null) {
						for (File f : files) {
							if (f.isFile()) {
								Path dest = savePath.resolve(f.getName());
								Files.move(f.toPath(), dest, StandardCopyOption.REPLACE_EXISTING);
								
								if (imageList.length() > 0) imageList.append(",");
								// 웹에서 접근 가능한 경로를 저장 (buildSaveDir() 사용)
								imageList.append("/review_upload/" + today() + "/" + f.getName());
							}
						}
					}
					vo.setImages(imageList.toString());
					
					// 임시 디렉토리 삭제
					Files.deleteIfExists(tempPath);
				} catch (IOException e) {
					log.error("Failed to finalize review images", e);
				}
			}
		}
		
		return rMapper.insertProductReview(vo);
	}

	@Override
	public String uploadTempReviewImage(MultipartFile file, String tempKey) {
		if (file == null || file.isEmpty() || tempKey == null) return null;
		
		String original = file.getOriginalFilename();
		String saved = newSavedName(original);
		Path tempPath = Paths.get(uploadRoot, buildTempDir(tempKey));
		
		try {
			Files.createDirectories(tempPath);
			file.transferTo(tempPath.resolve(saved).toFile());
			return saved;
		} catch (IOException e) {
			log.error("Failed to upload temp review image", e);
			throw new RuntimeException("Upload failed", e);
		}
	}
	@Override
	public List<ProductReviewDTO> getReviewListByProductId(int product_id, String sortBy, String filterRating, String filterImage) {
		Map<String, Object> params = new HashMap<>();
		params.put("product_id", product_id);
		params.put("sortBy", sortBy);
		params.put("filterRating", filterRating);
		params.put("filterImage", filterImage);
		return rMapper.getReviewListWithParams(params);
	}
	@Override
	public ProductReviewDTO getTopReviewByProductId(int product_id) {
		return rMapper.getFirstTopReview(product_id);
	}
	@Override
	public List<ProductForAdminListDTO> getAdminList() {
		return pMapper.getProductAdminList();
	}
	@Override
	public List<ProductForAdminListDTO> getAdminListByCategoryId(int category_id) {
		return pMapper.getProductAdminListByCategoryId(category_id);
	}
	@Override
	public List<ProductForAdminListDTO> getAdminListByPrice() {
		return pMapper.getProductAdminListByPrice();
	}
	@Override
	public int modifyProductReview(ProductReviewVO vo) {
		return rMapper.updateProductReview(vo);
	}
	@Override
	public int removeProductReview(int product_review_id) {
		return rMapper.deletePrdouctReview(product_review_id);
	}
	@Override
	public List<ProductReviewDTO> getReviewListByUserId(int user_id) {
		return rMapper.getReviewOneOrList(user_id, "user");
	}
	@Override
	public ProductReviewDTO getProductReviewDTO(int product_review_id) {
		return rMapper.getReviewOneOrList(product_review_id, "review").get(0);
	}
	//검색
	@Override
	public List<ProductForListDTO> searchProduct(SearchProductDTO search){
		return pMapper.searchProductList(search);
	}
	@Override
	public ProductCategoryVO getCategoryInfo(int category_id) {
		return pMapper.selectOneCategory(category_id);
	}

	@Override
	public List<ProductCategoryVO> selectListCategory() {
		return pMapper.selectListCategory();
	}

	@Override
	public int registerProduct(ProductVO vo, String tempKey) {
		// 1. 상품 기본 정보 저장 (selectKey에 의해 vo.product_id에 값이 채워짐)
		int result = pMapper.insertProduct(vo);
		if (result <= 0) return 0;

		int productId = vo.getProduct_id();
		File tempDir = new File(uploadRoot, "product_upload/_temp/" + tempKey);

		if (tempDir.exists() && tempDir.isDirectory()) {
			File[] files = tempDir.listFiles();
			if (files != null) {
				// 2. 상품별 영구 저장 디렉토리 생성
				File finalDir = new File(uploadRoot, "product_upload/" + productId);
				if (!finalDir.exists()) finalDir.mkdirs();

				for (int i = 0; i < files.length; i++) {
					File f = files[i];
					String savedName = f.getName();
					File dest = new File(finalDir, savedName);

					try {
						Files.move(f.toPath(), dest.toPath(), StandardCopyOption.REPLACE_EXISTING);

						// 3. 이미지 메타데이터 DB 저장
						ProductImageVO imgVO = new ProductImageVO();
						imgVO.setProduct_id(productId);
						imgVO.setOriginal_name(savedName); // 임시 저장시 원본명을 알 수 없으므로 저장된 이름 사용
						imgVO.setSaved_name("product_upload/" + productId + "/" + savedName);
						imgVO.setFile_size((int) dest.length());
						// 첫 번째 이미지를 썸네일로 설정 (단순화)
						imgVO.setIs_thumbnail(i == 0 ? "Y" : "N");

						pMapper.insertProductImage(imgVO);
					} catch (IOException e) {
						log.error("Failed to move product image: " + savedName, e);
					}
				}
			}
			// 임시 디렉토리 삭제
			tempDir.delete();
		}
		return productId;
	}

	@Override
	public String uploadTempProductImage(MultipartFile file, String tempKey) {
		String subDir = "product_upload/_temp/" + tempKey;
		File dir = new File(uploadRoot, subDir);
		if (!dir.exists()) dir.mkdirs();

		String originalName = file.getOriginalFilename();
		String savedName = newSavedName(originalName);
		File target = new File(dir, savedName);

		try {
			file.transferTo(target);
			return savedName;
		} catch (IOException e) {
			log.error("Failed to upload temp product image", e);
			return null;
		}
	}
}


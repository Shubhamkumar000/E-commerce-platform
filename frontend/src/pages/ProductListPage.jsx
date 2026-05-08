import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { validURLConvert } from "../utils/validURLConvert";

const ProductListPage = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ");
  const AllSubCategory = useSelector((state) => state.product.allSubCategory);
  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];
  const [DisplaySubCategory, setDisplaySubCategory] = useState([]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }
        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category.some((el) => {
        return el._id == categoryId;
      });
      return filterData ? filterData : false;
    });
    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  return (
    <section className="bg-slate-50">
      <div className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sub category */}
          <aside className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="px-4 py-4 border-b border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Categories</p>
              <h2 className="mt-2 text-lg font-semibold text-slate-900">Browse</h2>
            </div>
            <div className="h-[70vh] overflow-y-auto scrollbarCustom">
              {DisplaySubCategory.map((s) => {
                const link = `/${validURLConvert(s?.category[0]?.name)}-${s?.category[0]._id}/${validURLConvert(s.name)}-${s._id}`;
                const isActive = subCategoryId === s._id;
                return (
                  <Link
                    key={s._id}
                    to={link}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 transition ${
                      isActive ? "bg-emerald-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 p-2">
                      <img
                        src={s.image}
                        alt="subCategory"
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className={`text-sm font-semibold ${isActive ? "text-emerald-700" : "text-slate-700"}`}>
                      {s.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Product */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className="px-6 py-5 border-b border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">Products</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{subCategoryName}</h3>
            </div>
            <div className="min-h-[70vh] max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6 gap-4">
                {data.map((p, index) => {
                  return (
                    <CardProduct
                      data={p}
                      key={p._id + "productSubCategory" + index}
                    />
                  );
                })}
              </div>
              {loading && <Loading />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;

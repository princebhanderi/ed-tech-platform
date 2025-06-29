import IconBtn from "./IconBtn"

export default function ConfirmationModal({ modalData }) {
  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center overflow-auto bg-admin-bg bg-opacity-70 backdrop-blur-sm">
      <div className="w-11/12 max-w-[380px] rounded-xl border border-admin-border bg-admin-card p-8 shadow-2xl flex flex-col items-center">
        <p className="text-xl font-bold text-admin-primary text-center">
          {modalData?.text1}
        </p>
        <p className="mt-3 mb-6 text-admin-text text-center">
          {modalData?.text2}
        </p>
        <div className="flex items-center gap-4 w-full justify-center">
          <button
            className="px-5 py-2 rounded-md bg-admin-danger text-admin-white font-semibold hover:bg-admin-danger/80 transition-colors text-sm w-1/2"
            onClick={modalData?.btn1Handler}
          >
            {modalData?.btn1Text}
          </button>
          <button
            className="px-5 py-2 rounded-md bg-admin-secondaryLight text-admin-bg font-semibold hover:bg-admin-secondary transition-colors text-sm w-1/2"
            onClick={modalData?.btn2Handler}
          >
            {modalData?.btn2Text}
          </button>
        </div>
      </div>
    </div>
  )
}
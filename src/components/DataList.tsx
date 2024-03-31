interface IImageListProps {
  items?: {
    url?: string | null;
    text?: string | null;
  }[];
}

export default function DataList({ items }: IImageListProps) {
  return (
    <>
      {items?.map((item, key) => (
        <div key={key}>
          {item?.url && <img src={item.url} alt="Some image" />}
          {item?.text && <p>{item.text}</p>}
        </div>
      ))}
    </>
  );
}

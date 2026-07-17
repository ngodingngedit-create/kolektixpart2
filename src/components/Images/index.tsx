import Image from 'next/image';
import config from '@/Config';
import kolektix from '../../assets/images/kolektix-square.webp';

interface ImagesProps {
  type: string;
  src?: string;
  path?: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const Images = ({ path, src, alt, width, height, className, type }: ImagesProps) => {
  const getSrc = () => {
    if (path) {
      if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
      }
      return `${config.assetUrl}${type}/${path}`;
    }
    return src ?? kolektix;
  };

  return (
    <Image
      src={getSrc()}
      alt={alt ? alt : 'images'}
      className={className ? `${className}` : 'w-full object-cover'}
      width={width ? width : 200}
      height={height ? height : 200}
    />
  );
};

export default Images;

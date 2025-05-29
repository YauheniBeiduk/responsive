import { LoadingIndicator } from './loading';

export const PageLoader = () => {
  return (
    <div className="container flex max-w-4xl items-center justify-center">
      <LoadingIndicator isLoading />
    </div>
  );
};

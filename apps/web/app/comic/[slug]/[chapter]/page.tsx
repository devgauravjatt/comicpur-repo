// async function getComicDetail(slug: string) {
//   // wait 5s
//   await new Promise((resolve) => setTimeout(resolve, 5000));
//   try {
//     const response = await honoClient.api.v1.public.comics
//       .$get({
//         query: { slug },
//       })
//       .then(async (res) => await res.json());

//     if (!response.success) return null;
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch comic detail:', error);
//     return null;
//   }
// }

// export default async function page({ params }: { params: { slug: string } }) {
//   const { slug } = await params;
//   return <div>page</div>;
// }

export async function GET(request) {
    const  token = '123'
    return new Response('Hello, Next.js!', {
        status: 200,
        headers: { 'Set-Cookie': `token=${token}` },
      })    
}
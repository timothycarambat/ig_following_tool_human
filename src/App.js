import { useState } from 'react';
import { CSVLink } from "react-csv";
import './App.css';

export default function App() {
  const [followers, setFollowers] = useState(null)
  const [following, setFollowing] = useState(null)
  const [listData, setListData] = useState([])
  const calcList = () => {
    if (followers === null || following === null) {
      alert('You must upload both files to run this tool.')
      return false;
    }

    const _followers = new Set([...followers])
    const _following = new Set([...following])
    const diff = [...new Set([..._following].filter(x => !_followers.has(x)))]
    setListData([...diff])
  }

  async function readFile(file) {
    try {
      let result = await new Promise((resolve) => {
        let fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsText(file, 'UTF-8');
      });
      return JSON.parse(result)
    } catch {
      console.log('Cannot parse JSON')
      return { relationships_followers: null }
    }
  }

  return (
    <div className='w-screen h-screen bg-white'>
      <div className='w-full mt-20 justify-center items-center flex flex-col gap-y-2'>
        <h1 className='font-semibold text-gray-800 underline text-lg md:text-5xl'>Instagram Follower / Following Detector</h1>
        <p className='text-xs text-center md:text-base text-gray-500'>Get a list of all people you are following that are not following back.</p>
        <p className='text-xs md:text-base text-gray-500'>by Timothy Carambat</p>
        <div className='flex gap-x-2'>
          <a href='https://twitter.com/tcarambat' rel='noreferrer' target='_blank' className='underline text-blue-500'>Twitter</a>
          <a href='https://www.tiktok.com/@timcarambat' rel='noreferrer' target='_blank' className='underline text-blue-500'>TikTok</a>
        </div>
        <a href='https://qr.ae/pvgG0H' rel='noreferrer' target='_blank' className='italic text-blue-500 underline'> How do I get these files?</a>
      </div>


      <div className='flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-4 w-full justify-center my-10'>
        <div className='w-fit p-4 border border-gray-400 rounded-lg flex flex-col justify-center items-center'>
          <p>Upload your <b>followers.json</b> file</p>
          <div className="flex justify-center">
            <div className="mb-3 w-96">
              <input
                onChange={async (e) => {
                  const { relationships_followers } = await readFile(e.target.files[0])
                  const data = relationships_followers.map((i) => i.string_list_data[0].value)
                  setFollowers(data)
                }}
                className="form-control block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="file"
              />
            </div>
          </div>

          {followers?.length > 0 && <p>Got {followers.length} Followers</p>}
        </div>

        <div className='w-fit p-4 border border-gray-400 rounded-lg flex flex-col justify-center items-center'>
          <p>Upload your <b>following.json</b> file</p>
          <div className="flex justify-center">
            <div className="mb-3 w-96">
              <input
                onChange={async (e) => {
                  const { relationships_following } = await readFile(e.target.files[0])
                  const data = relationships_following.map((i) => i.string_list_data[0].value)
                  setFollowing(data)
                }}
                className="form-control block
              w-full
              px-3
              py-1.5
              text-base
              font-normal
              text-gray-700
              bg-white bg-clip-padding
              border border-solid border-gray-300
              rounded
              transition
              ease-in-out
              m-0
              focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                type="file"
              />
            </div>
          </div>
          {following?.length > 0 && <p>Got {following.length} Following</p>}
        </div>
      </div>

      {listData.length === 0 ? (
        <div className='flex gap-x-4 w-full justify-center'>
          <button
            onClick={calcList}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg'>
            Get list
          </button>
        </div>
      ) : (
        <div className='flex gap-x-4 w-full items-center flex-col gap-y-4'>
          <p className='text-gray-600 text-sm md:text-lg text-center'>{listData.length} people found that you are following and are not following back.</p>
          <CSVLink
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg'
            filename={`ig_following_not_followback_${Number(new Date())}`}
            headers={['handle', 'link']}
            data={[...listData.map((i) => {
              return [i, `https://www.instagram.com/${i}`]
            })]}
          >
            Download CSV
          </CSVLink>

          <div className='relative w-full md:w-1/2'>
            <table class="w-full text-sm text-left text-gray-500 ">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    IG Handle
                  </th>
                </tr>
              </thead>
              <tbody>
                {listData.map((i, idx) => (
                  <tr key={idx} class="bg-white border-b">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      <a href={`https://www.instagram.com/${i}`} target='_blank' rel='noreferrer' className='text-blue-500 underline'>{i}</a>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div >
  );
}
export default function LayoutFooter() {
  const licenseLink = process.env.licenseLink;

  return (
    <div className="py-2 border-b-2 border-t-1 border-ui-primary bg-ui-footer">
      <div className="container">
        <div
          className="
        flex
        lg:items-center
        items-end
        justify-between
        -mx-2
        sm:-mx-4
        flex-col
        sm:flex-row
      "
        >
          <div
            v-if="!originalLink || !originalPath"
            className="px-2 mr-auto sm:px-4"
          >
            <p className="mb-0.5 text-sm">
              За авторством{' '}
              <a
                href="https://github.com/webdoky/"
                target="_blank"
                rel="noopener noreferrer"
              >
                спільноти WebDoky
              </a>
              , доступно за ліцензією{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/2.5/"
                target="_blank"
                rel="license noopener noreferrer"
              >
                CC-BY-SA 2.5
              </a>{' '}
              (<a href={licenseLink}>докладніше тут</a>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

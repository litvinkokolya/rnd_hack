import io
import mimetypes
import unicodedata

from django.utils.http import quote
from django.http import HttpResponse


def convert_rfc5987(file_name):
    ascii_name = unicodedata.normalize('NFKD', file_name).encode('ascii', 'ignore').decode()
    new_file_name = ascii_name
    if new_file_name != file_name:
        new_file_name = quote(file_name)

    return new_file_name


def make_file_response(data: io.BytesIO, file_name: str, content_type: str = '') -> HttpResponse:
    if not content_type:
        guessed = mimetypes.guess_type(file_name)
        if guessed:
            content_type = guessed[0] or ''

    response = HttpResponse(
        data,
        content_type=content_type
    )
    response['Content-Disposition'] = 'attachment; filename=' + convert_rfc5987(file_name)
    return response


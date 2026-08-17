using MCClient2.Models.Managers;
using NUnit.Framework;
using System;
using System.IO;
using System.Linq;

namespace MCClient2.Tests
{
    [TestFixture]
    public class PathHelperTest
    {
        [Test]
        public void GuidTest()
        {
            // Arrange
            var text = PathHelper.GetGuid();
            bool expected = true;

            // Act
            Guid guid = Guid.Empty;
            bool actual = Guid.TryParse(text, out guid);

            // Assert
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void GetDirPathTest_Case1()
        {
            // Arrange
            var text = PathHelper.GetGuid();
            string expected = text;

            // Act
            string dirPath = PathHelper.GetDirPath(text);
            string actual = Path.GetFileName(dirPath);

            // Assert
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void GetDirPathTest_Case2()
        {
            // Arrange
            string dirName = "test";
            string subDirName1 = "111";
            string subDirName2 = "222";
            string expected = Path.Combine(dirName, subDirName1, subDirName2);

            // Act
            string dirPath = PathHelper.GetDirPath(dirName, subDirName1, subDirName2);
            var splitChars = new char[] { '\\' };
            string[] tokens = dirPath.Split(splitChars, StringSplitOptions.RemoveEmptyEntries);
            string[] subDirNames = tokens.Skip(tokens.Length - 3).Take(3).ToArray();
            string actual = Path.Combine(subDirNames);

            // Assert
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void ReplaceDirectorySeparatorCharTest()
        {
            // Arrange
            var path = @"C:\temp\aaa\bbb\test.txt";
            string expected = @"C:\\temp\\aaa\\bbb\\test.txt";

            // Act
            string actual = PathHelper.ReplaceDirectorySeparatorChar(path);

            // Assert
            Assert.AreEqual(expected, actual);
        }

        [Test]
        public void GetRandomFileNameTest()
        {
            // Arrange
            bool expected = true;

            // Act
            var name1 = PathHelper.GetRandomFileName();
            var name2 = PathHelper.GetRandomFileName();
            bool actual = !(string.IsNullOrWhiteSpace(name1) || string.IsNullOrWhiteSpace(name2) || name1 == name2);

            // Assert
            Assert.AreEqual(expected, actual);
        }
    }
}
